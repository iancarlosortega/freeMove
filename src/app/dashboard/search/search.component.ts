import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { SearchService } from 'src/app/services';
import { Route } from 'src/app/interfaces';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  routes: Route[] = [];
  suggestedRoutes: Route[] = [];
  query: string = '';
  isLoading: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(
        tap(({ q }) => (this.query = q)),
        tap(() => (this.isLoading = true)),
        switchMap(() => this.searchService.searchRoutes(this.query))
      )
      .subscribe((routes) => {
        this.routes = routes;
        this.searchService
          .searchSuggestedRoutes(this.query)
          .subscribe((routes) => {
            this.suggestedRoutes = routes.filter(
              (route) => !this.routes.find((r) => r.idRoute === route.idRoute)
            );
            this.isLoading = false;
          });
      });
  }
}
