
export class GenericHttpStream<T> {
  private readonly http = inject(HttpClient);
  private readonly map = new Map<number, BehaviorSubject<T|null>>();
  protected fetch_fn!: (id: any) => void;


  get(id: number,force:boolean=false): Observable<T|null> {
    if (!this.map.has(id)) {
      const subject = new BehaviorSubject<T|null>(null);
      this.map.set(id,subject);
      this.fetch_fn(id);
    }
    return this.map.get(id)!.asObservable();
  }
}