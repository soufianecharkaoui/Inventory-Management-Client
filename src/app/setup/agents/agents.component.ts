import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { GET_AGENTS, ADD_AGENT, DELETE_AGENT } from 'app/graphql';
import { map } from 'rxjs/operators';
import { Agent } from 'app/types';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {

  agents: Agent[];
  agent: Agent;
  
  displayedColumns: string[] = ['name', 'email', 'status', 'edit'];
  dataSource: MatTableDataSource<Agent>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private apollo: Apollo,
    public dialog: MatDialog) { 
      this.dataSource = new MatTableDataSource(this.agents);
    }

  
  
  ngOnInit() {
    this.apollo.watchQuery({
      query: GET_AGENTS
    })
    .valueChanges.pipe(map((result: any) => result.data.getAgents))
    .subscribe(data => {
      this.agents = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  delete(agent: Agent) {
    this.apollo.mutate({
      mutation: DELETE_AGENT,
      variables: {
        id: agent.id
      }
    })
    .subscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CRUDAgents, {
      width: '250px' 
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'crud-agents',
  templateUrl: 'crud-agents.html',
})
export class CRUDAgents implements OnInit{

  agentForm: FormGroup;
  agent: Agent;

  @ViewChild('aform', {static: true}) agentFormDirective;

  constructor(
    public dialogRef: MatDialogRef<CRUDAgents>,
    @Inject(MAT_DIALOG_DATA) public data: Agent,
    private fb: FormBuilder,
    private apollo: Apollo) {}

  createForm() {
    this.agentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get name() { return this.agentForm.get('name'); }
  get email() { return this.agentForm.get('email'); }

  ngOnInit() {
    this.createForm();
  }

  save() {
    this.agent = this.agentForm.value;
    this.apollo.mutate({
      mutation: ADD_AGENT,
      variables: {
        name: this.agent.name,
        email: this.agent.email
      },
      refetchQueries: ['getAgents']
    })
    .subscribe();
    this.agentFormDirective.resetForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
