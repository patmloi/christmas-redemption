# Christmas Redemption

## Setup

### Installation

1. Clone the repository to your local machine
`git clone git@github.com:patmloi/christmas-redemption.git`
2. Navigate to the project directory.
`cd christmas-redemption/`
3. Install project dependencies.
`npm i`

### Usage

To run in development environment: 

`npm run dev`

To run in production environment: 

`npm run build`

`npm start`

To run tests:

`npm test`

## Database design

### Data exploration

1. Statements from assignment
    1. Assume that each staff pass is a ****unique ID****.
    2. The timestamp is in ****epoch milliseconds****.
    3. For every staff in the file, ****they can only belong to one and only one team****.
2. CSV files
    
    
    | File name | Number of rows | Number of columns | df.info() Output |
    | --- | --- | --- | --- |
    | staff-id-to-team-mapping.csv | 3 | 3 | `<class 'pandas.core.frame.DataFrame'>
    RangeIndex: 3 entries, 0 to 2
    Data columns (total 3 columns): # Column Non-Null Count Dtype
    --- ------ -------------- ----- 0 staff_pass_id 3 non-null object 1 team_name 3 non-null object 2 created_at 3 non-null int64
    dtypes: int64(1), object(2)
    memory usage: 204.0+ bytes` |
    | staff-id-to-team-mapping-long.csv | 5000 | 3 | `<class 'pandas.core.frame.DataFrame'>
    RangeIndex: 5000 entries, 0 to 4999
    Data columns (total 3 columns): # Column Non-Null Count Dtype
    --- ------ -------------- ----- 0 staff_pass_id 5000 non-null object 1 team_name 5000 non-null object 2 created_at 5000 non-null int64
    dtypes: int64(1), object(2)
    memory usage: 117.3+ KB` |
3. Observed column value properties
    
    
    | Column name | Description | Unique? | Data type | Data format | **Example values** |
    | --- | --- | --- | --- | --- | --- |
    | `staff_pass_id` | Staff pass ID to identify staff. | `true` | [prefix]_[suffix]Prefix: One of the following values: BOSS, MANAGER, STAFF
    
    Suffix: A random character alphanumeric string with capitalised letters, with a variable length (11 characters in staff-id-to-team-mapping.csv, and 12 characters in staff-id-to-team-mapping-long.csv).  | `string` | BOSS_6FDFMJGFV6YMMANAGER_P49NK2CS3B5GSTAFF_H123804820G |
    | `team_name` | Team name that the staff belongs to. | `true` | String with capitalised letters. | `string` | staff-id-to-team-mapping.csv: BASS, RUST
    
    staff-id-to-team-mapping-long.csv: GRYFFINDOR, HUFFLEPUFF, RAVENCLAW, SLYTHERIN |
    | `created_at` | Time entry was created, in epoch milliseconds. | `false` | 13-character integer. | `number` | 1620761965320, 1614784710249, 1618869819036   |

### Tables

The following databases are created: `teams`, `staff` and `redemptions`.

1. `teams`
    
    
    | Column name | Primary key? | Unique? | Not null? | Data type | Considerations |
    | --- | --- | --- | --- | --- | --- |
    | `team_id` | `true` | `true` | `true` | `INTEGER` | Unique, immutable identifier for a team. |
    | `team_name` | `true` | `true` | `true` | `TEXT` | Team name may change during restructuring. |
2. `staff`
    
    
    | **Column name** | **Primary key?** | **Unique?** | **Not null?** | **Data type** | **Consideration** |
    | --- | --- | --- | --- | --- | --- |
    | `staff_id` | `true` | `true` | `true` | `INTEGER` | Unique, immutable identifier for a staff record. |
    | `staff_pass_id` | `false` | `true` | `true` | `TEXT` | The unique identifier printed on the staff pass. |
    | `team_id` | `false` | `false` | `true` | `INTEGER` | Links staff member to their assigned team. If the staff is transferred to another team, team details can be retrieved from `teams` instead of changing team relevant information here. |
    | `created_at` | `false` | `false` | `false` | `BIGINT` | Timestamp of when this staff record was created. Not essential for core logic (as per your note). |
3. `redemptions`
    
    
    | **Column name** | **Primary key?** | **Unique?** | **Not null?** | **Data type** | **Consideration** |
    | --- | --- | --- | --- | --- | --- |
    | `redemption_id` | `true` | `true` | `true` | `INTEGER` | Unique, immutable identifier for a redemption transaction. |
    | `team_id` | `false` | `true` | `true` | `INTEGER` | The team that made the redemption. This unique constraint enforces a one-time redemption per team, and checking by a small integer `staff_id` is more efficient than checking a sting `staff_pass_id`. |
    | `staff_id` | `false` | `false` | `true` | `INTEGER` | The specific staff member who performed the redemption. If staff details are updated in the event of a promotion (`STAFF` prefix changed to `MANAGER` prefix), details will be changed in `staff` instead of changing staff-related details here. |
    | `redeemed_at` | `false` | `true` | `false` | `BIGINT` | Timestamp of when the redemption occurred.  |

## End points

### End point summary table

| **API Task** | **Endpoint** | **Method** |
| --- | --- | --- |
| Perform look up of the representative's staff pass ID against the mapping
file. | `/api/staff/:staffPassId` | `GET` |
| Verify if the team can redeem their gift by comparing the team name
against past redemption in the redemption data. | `/api/redemption/checkEligibility/:teamName` | `GET` |
| Add new redemption to the redemption data if this team is still eligible for redemption, otherwise, do nothing and send the representative away. | `/api/redemption/redeem/:staffPassId` | `GET` |

### Requests

| Endpoint | **Key** | **Format/Type** | **Required** | **Example Value** |
| --- | --- | --- | --- | --- |
| `/api/staff/:staffPassId` | `staffPassId` | `string` | `true` | BOSS_6FDFMJGFV6YM |
| `/api/redemption/checkEligibility/:teamName` | `teamName` | `string` | `true` | GRYFFINDOR |
| `/api/redemption/redeem/:staffPassId` | `staffPassId` | `string` | `true` | BOSS_6FDFMJGFV6YM |

## Test coverage

Test coverage incomplete, tests needed for the following services.

 `csvLoader.service.ts`, `database.service.ts`, `redemption.service`, `storage.service`