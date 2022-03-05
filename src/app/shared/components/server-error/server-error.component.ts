import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'smp-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})
export class ServerErrorComponent implements OnInit {
  @Input() errorMessage: string;

  constructor() { }

  ngOnInit(): void { }
}
