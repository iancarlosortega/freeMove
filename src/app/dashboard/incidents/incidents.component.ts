import { Component, OnInit } from '@angular/core';
import { IncidentService } from 'src/app/services';
import { Incident } from 'src/app/interfaces';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.css'],
})
export class IncidentsComponent implements OnInit {
  incidents: Incident[] = [];
  incidentsAux: Incident[] = [];
  incidentsTotal: Incident[] = [];
  numberOfIncidents: number = 0;
  isLoading: boolean = true;

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
    this.incidentService.getActiveIncidents().subscribe((incidents) => {
      this.incidents = incidents;
      this.incidentsAux = incidents;
      this.incidentsTotal = incidents;
      this.numberOfIncidents = incidents.length;
      this.incidents = this.incidentsTotal.slice(0, 9);
      this.isLoading = false;
    });
  }

  paginateIncidents(event: any) {
    const primero = event.first;
    const ultimo = primero + event.rows;
    this.incidents = this.incidentsAux.slice(primero, ultimo);
    window.scroll(0, 0);
  }

  filterIncidents(event: any) {
    const value = event.target.value.toLowerCase().trim();
    this.incidents = this.incidentsTotal.filter((incident) =>
      this.removeAccents(incident.title.toLowerCase()).includes(value)
    );
    this.numberOfIncidents = this.incidents.length;
    this.incidentsAux = this.incidents;
    this.incidents = this.incidents.slice(0, 9);
  }

  removeAccents(text: string) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  getIncidentIcon(category: string) {
    switch (category) {
      case 'Accidente':
        return '/assets/icons/accident.png';
      case 'Robo':
        return '/assets/icons/robbery.png';
      case 'Ciclovía en mal estado':
        return '/assets/icons/road-bad-state.png';
      case 'Ciclovía obstruida':
        return '/assets/icons/road-blocked.png';
      default:
        return '/assets/icons/accident.svg';
    }
  }
}
