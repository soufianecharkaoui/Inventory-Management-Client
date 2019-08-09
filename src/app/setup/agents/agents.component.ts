import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Agent } from 'app/types';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { GET_AGENTS, DELETE_AGENT, ADD_AGENT, REVOKE_AGENT, UPDATE_AGENT } from 'app/services/agents.graphql';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {

  agents: Agent[];
  agent: Agent;
  
  displayedColumns: string[] = ['name', 'email', 'status', 'edit', 'changeStatus'];
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
      this.dataSource = new MatTableDataSource(this.agents);
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

  edit(agent: Agent) {
    const dialogRef = this.dialog.open(CRUDAgents, {
      width: '250px',
      data: agent
    });
  }

  revoke(agent: Agent) {
    this.apollo.mutate({
      mutation: REVOKE_AGENT,
      variables: {
        id: agent.id
      }
    })
    .subscribe();
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
      name: [this.data ? this.data.name : '', Validators.required],
      email: [this.data ? this.data.email : '', [Validators.required, Validators.email]]
    });
  }

  get name() { return this.agentForm.get('name'); }
  get email() { return this.agentForm.get('email'); }

  ngOnInit() {
    this.createForm();
  }

  save() {
    if (this.data) {
      this.apollo.mutate({
        mutation: UPDATE_AGENT,
        variables: {
          id: this.data.id,
          name: this.agentForm.value.name,
          email: this.agentForm.value.email
        },
        refetchQueries: ['getAgents']
      })
      .subscribe();
    } else {
      this.apollo.mutate({
        mutation: ADD_AGENT,
        variables: {
          name: this.agentForm.value.name,
          email: this.agentForm.value.email
        },
        refetchQueries: ['getAgents']
      })
      .subscribe();
    }
    this.agentFormDirective.resetForm();
    this.dialogRef.close();
  }

}
