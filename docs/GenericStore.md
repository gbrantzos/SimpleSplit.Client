# Generic Store

`Generic store` and the accompanying `Generic API Client` try to hide the 
complexity of handling of API calls and exposing store to components, using 
`BehaviourSubject` observables.

## Loading Status

Call state enum has 5 values:
```
export enum CallState {
  Initial = 'INITIAL',
  Pending = 'PENDING',
  Finished = 'FINISHED',
  Failed = 'FAILED',
  NoData = 'NODATA'
}

```
- **Pending** is a transient state, while the API call is in progress 
- **Error**, **No data** and **Finished** are terminal states
- Currently the only event available is **loading event**


```mermaid
graph TB
    init([ Initial state ])
    pending(Pending)
    pending --> success{API Call<br/>successful?}
    success --> |No| errors[Error]
    success --> |Yes| data_found{Data found?}
    data_found --> |No| no_data[No data]
    data_found --> |Yes| finished[Finished]
    init -->|Load event| pending
    no_data -->| Load event | pending
    errors -->|Load event| pending
    finished -->|Load event| pending

classDef green fill:#9d6,stroke:#252525,stroke-width:3px,color:#151515;
classDef orange fill:#fa1,stroke:#252525,stroke-width:3px,color:#222;
classDef red fill:#922,stroke:#252525,stroke-width:3px,color:#fff;

class success,data_found green
class pending orange
class errors,no_data,finished red
```
