import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { add_filters_to_params } from '../http';
import { ExternalEnvironment, ExternalEnvironmentType, Collection, CollectionEnvironment, ExternalEnvironmentAuth } from './interfaces/environment-interface';
import { DialogService } from '../dialogs';
import { EnvironmentAuthCreateForm } from './components/environment-auth-create-form/environment-auth-create-form';


@Injectable({
  providedIn: 'root',
})
export class ExtEnvironmentService {
  http = inject(HttpClient);
  private readonly dialog = inject(DialogService);

  open_environment_auth_create_form(environment:ExternalEnvironment) {
    return this.dialog.openDialog(
      EnvironmentAuthCreateForm,
      'Create Environment Auth',
      environment,
      'm'
    )
  }

  getExternalEnvironments(
    filters?: any
  ): Observable<ExternalEnvironment[]> {
    let params = add_filters_to_params(filters);
    return this.http.get<ExternalEnvironment[]>(`0/env/`,{params: params});
  }

  addExternalEnvironment(environment: ExternalEnvironment): Observable<ExternalEnvironment> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ExternalEnvironment>(`0/env/`, environment, { headers });
  }

  create_external_environment_auth(ext_env_auth: Partial<ExternalEnvironmentAuth>) {
    return this.http.post<ExternalEnvironmentAuth>(`0/env/auth/`,ext_env_auth,);
  }

  get_external_environment_types(): Observable<ExternalEnvironmentType[]> {
    return this.http.get<ExternalEnvironmentType[]>(`0/env/type/`);
  }

  get_external_environment_type(id: number): Observable<ExternalEnvironmentType> {
    return this.http.get<ExternalEnvironmentType>(`0/env/type/${id}/`);
  }

  getCollections(fetch_envs: boolean=false): Observable<Collection[]> {
    if (fetch_envs) {
      let params = new HttpParams().set('_envs',true);
      return this.http.get<Collection[]>(`0/env-coll/`,{params: params});
    }
    return this.http.get<Collection[]>(`0/env-coll/`);
  }

  getCollection(id: number): Observable<Collection> {
    return this.http.get<Collection>(`0/env-coll/${id}`);
  }

  getCollectionEnvironments(id: number): Observable<CollectionEnvironment[]> {
    return this.http.get<CollectionEnvironment[]>(`0/env-coll/${id}/envs/`);
  }

  addCollection(name: string) {
    let data = new FormData();
    data.append('name',name);
    return this.http.post<Collection>(`0/env-coll/`,data);
  }

  delCollection(id: number): Observable<any> {
    return this.http.delete(`0/env-coll/${id}/`);
  }

  addCollectionEnvironment(collectionid: number,environmentid: number): Observable<CollectionEnvironment> {
    return this.http.post<CollectionEnvironment>(`0/env-coll/${collectionid}/envs/`,{
      "environment_id" : environmentid
    });
  }

  delCollectionEnvironment(id: number) {
    let params = new HttpParams().set('id',id)
    return this.http.delete<CollectionEnvironment[]>(`0/env-coll/${id}/envs/`,{params: params});
  }

}
