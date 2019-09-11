import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { GET_TRANSACTION } from 'app/services/transactions.graphql';
import { Transaction } from 'app/types';
import * as jsPDF from "jspdf";
import * as html2canvas from "html2canvas";

@Component({
  selector: 'app-print-transaction',
  templateUrl: './print-transaction.component.html',
  styleUrls: ['./print-transaction.component.scss']
})
export class PrintTransactionComponent implements OnInit {

  transaction: Transaction;

  constructor(private route: ActivatedRoute,
    private apollo: Apollo,
    private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: Params) => {
      console.log();
      this.apollo.watchQuery({
        query: GET_TRANSACTION,
        variables: {
          id: params.params.id
        }
      })
      .valueChanges.pipe(map((result: any) => result.data.getTransaction))
      .subscribe(data => this.transaction = data);
    });
    setTimeout(() => {
      // let doc = new jsPDF();
      // doc.addHTML(document.getElementById("component-container"), function() {
      //    doc.save("transaction.pdf");
      // });
    }, 2000);
    /*window.onafterprint = () => {
      window.close();
    }*/
  }

}
