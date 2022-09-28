import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
import { IncidentService } from 'src/app/services';
import { Incident } from 'src/app/interfaces';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.css'],
})
export class IncidentsComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  incidents: Incident[] = [];
  isLoading: boolean = true;
  isDisabled: boolean = false;
  scrollable: boolean = true;

  constructor(
    private observer: BreakpointObserver,
    private router: Router,
    private incidentService: IncidentService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.incidentService.getIncidents().subscribe((incidents: Incident[]) => {
      this.incidents = incidents;
      this.isLoading = false;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.observer.observe(['(min-width: 1280px)']).subscribe((res) => {
        if (res.matches) {
          this.scrollable = false;
        } else {
          this.scrollable = true;
        }
      });
    }, 0);
  }

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  toggleStatus(event: any, id: string) {
    this.isDisabled = true;
    this.incidentService.toggleIncidentStatus(id, event.checked).then((_) => {
      this.toastrService.success('Estado actualizado');
      this.isDisabled = false;
    });
  }

  goToIncident(id: number) {
    this.router.navigate(['dashboard/incidentes', id]);
  }
}
