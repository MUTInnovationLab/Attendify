import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, forkJoin } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  studentNumber!: string;

  constructor(private firestore: AngularFirestore) {}

  searchPendingRequests(): Observable<any[]> {
    return this.firestore.collection('allModules').snapshotChanges().pipe(
      switchMap(allModulesSnapshot => {
        const moduleObservables = allModulesSnapshot.map(moduleDoc => {
          const moduleCode = moduleDoc.payload.doc.id;
          return this.firestore.collection(`allModules/${moduleCode}`).snapshotChanges().pipe(
            switchMap(moduleCollectionsSnapshot => {
              const collectionObservables = moduleCollectionsSnapshot.map(moduleCollection => {
                const moduleName = moduleCollection.payload.doc.id;
                return this.firestore.collection(`allModules/${moduleCode}/${moduleName}/22116523/students`, ref =>
                  ref.where('status', '==', 'pending')
                ).snapshotChanges().pipe(
                  map(studentsSnapshot => studentsSnapshot.map(studentDoc => {
                    const data = studentDoc.payload.doc.data() as any;
                    const id = studentDoc.payload.doc.id;
                    return { id, ...data };
                  }).filter(student => student.studentNumber === this.studentNumber))
                );
              });
              return forkJoin(collectionObservables).pipe(
                map(results => results.flat() as any[]), // Flatten the results
                catchError(error => {
                  console.error('Error searching for pending requests:', error);
                  return of([]); // Return an empty array in case of error
                })
              );
            })
          );
        });
        return forkJoin(moduleObservables).pipe(
          map(results => results.flat() as any[]), // Flatten the results
          catchError(error => {
            console.error('Error searching for pending requests:', error);
            return of([]); // Return an empty array in case of error
          })
        );
      })
    );
  }
}
