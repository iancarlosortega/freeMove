import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, map, Subject } from 'rxjs';
import { Route } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private firestore: AngularFirestore) {}

  searchRoutes(query: string) {
    return this.firestore
      .collection<Route>('routes', (ref) =>
        ref.where('name', '==', query).orderBy('createdAt', 'desc').limit(10)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Route;
            data.idRoute = a.payload.doc.id;
            return data;
          })
        )
      );
  }

  searchSuggestedRoutes(query: string) {
    const query1$ = this.firestore
      .collection('routes', (ref) =>
        ref.where('name', '>=', query.toLowerCase()).limit(10)
      )
      .valueChanges();

    const query2$ = this.firestore
      .collection('routes', (ref) =>
        ref.where('keywords', 'array-contains', query)
      )
      .valueChanges();

    return combineLatest([query1$, query2$]).pipe(
      map(([query1, query2]) => {
        const routes: Route[] = [];
        query1.forEach((route: any) => {
          if (!routes.find((r) => r.idRoute === route.idRoute)) {
            routes.push(route);
          }
        });
        query2.forEach((route: any) => {
          if (!routes.find((r) => r.idRoute === route.idRoute)) {
            routes.push(route);
          }
        });
        return routes;
      })
    );
  }
}
