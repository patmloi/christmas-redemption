# Christmas Redemption

## Prerequisites

## Installation

Clone the repository to your local machine:

```
git clone git@github.com:patmloi/christmas-redemption.git
```

Navigate to the project directory:

```
cd christmas-redemption/
```

Install the project dependencies including TypeScript and Nodemon:

```
npm i
```

## Usage

For development purposes, you can run the application using Nodemon to automatically restart the server when changes are detected. Execute the following command:

```
npm run dev
```

This will start the server at `http://localhost:3000` .

For production, you can build the TypeScript files and then start the server. Run the following commands:

```
npm run build
npm start
```

## Project Structure

The project structure is organized as follows:

* `data`:

  + `staff-id-to-team-mapping.ts`
  + `staff-id-to-team-mapping-long.ts`
* `src`: Contains TypeScript source files.

  + `config`:
    - `config.ts`:
  + `controllers`:
    - `redemptionController.ts`
  + `middlewares`:
    - `errorHandler.ts`:
  + `models`:
    - `redemption.model.ts`:
    - `staff.model.ts`:
  + `routes`:
    - `redemptionRoutess.ts`
  + `services`: Contains services.
    - `csvLoader.service.ts`:
    - `database.service.ts`:
    - `redemption.service.ts`:
    - `staff.service.ts`:
    - `storage.service.ts`:
  + `app.ts`: Defines the Express application and initialises the global error handler.
  + `server.ts`: Initialises databases, services and starts the Express application defined in `app.ts`.
* `tests`
* `package.json`: Project configuration and dependencies.
* `tsconfig.json`: TypeScript configuration.

## Data

### Datasets received

**Relevant statements from assignment description:**

1. Assume that each staff pass is a **unique ID**.
2. The timestamp is in **epoch milliseconds**.
3. For every staff in the file, **they can only belong to one and only one team**.

#### staff-id-to-team-mapping.csv

**Number of rows**: 3

**Number of columns**: 3

**Output from df.info()**

```
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 3 entries, 0 to 2
Data columns (total 3 columns):
 #   Column         Non-Null Count  Dtype 
---  ------         --------------  ----- 
 0   staff_pass_id  3 non-null      object
 1   team_name      3 non-null      object
 2   created_at     3 non-null      int64 
dtypes: int64(1), object(2)
memory usage: 204.0+ bytes
```

#### staff-id-to-team-mapping-long.csv

**Number of rows**: 5000

**Number of columns**: 3

**Output from df.info()**

```
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 5000 entries, 0 to 4999
Data columns (total 3 columns):
 #   Column         Non-Null Count  Dtype 
---  ------         --------------  ----- 
 0   staff_pass_id  5000 non-null   object
 1   team_name      5000 non-null   object
 2   created_at     5000 non-null   int64 
dtypes: int64(1), object(2)
memory usage: 117.3+ KB
```

### Staff schema


| Column        | Description                                    | Unique? | Data Type          | Data Format                                                                                                                                                                   | Example values                                                     |
| --------------- | ------------------------------------------------ | --------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| staff_pass_id | Staff pass ID to identify staff.               | TRUE    | `string`           | [prefix]_[suffix]<br />Prefix: One of the following values: <br />BOSS, MANAGER, STAFF<br />Suffix: <br />A random 12-character alphanumeric string with capitalised letters. | BOSS_6FDFMJGFV6YM<br />MANAGER_P49NK2CS3B5G<br />STAFF_H123804820G |
| team_name     | Team name that the staff belongs to.           | FALSE   | `string`           | String with capitalised letters.                                                                                                                                              | BASS, RUST<br /> GRYFFINDOR, HUFFLEPUFF, RAVENCLAW, SLYTHERIN      |
| created_at    | Time entry was created, in epoch milliseconds. | FALSE   | `number` (Integer) | 13-character integer.                                                                                                                                                         | 1620761965320<br />1614784710249<br />1618869819036                |

### Redemption schema


## Logic

### 1. Perform look up of the representative's staff pass ID against the mapping file

1. If representative staff ID present in mapping file, show all details in mapping file for that row
2. If representative staff ID not present in mapping file, show error message
3. If string does not follow representative staff ID pattern, show error message
   (Error message should contain information on valid staff ID)
   (e.g Invalid prefix, length of number not correct)
4. If string is empty - frontend prevent form submission, backend handling provide team name
5. If representative staff ID has lowercase or mixed capitalisation, convert to uppercase and match

### 2. Verify if the team can redeem their gift by comparing the team name against past redemption in the redemption data

1. If team selected can redeem gift, show can redeem
2. If team selected cannot redeem gift, show cannot redeem
3. If team invalid (not present in mapping file), error handling
   Frontend avoids this issue by showing a dropdown with only teams present.
4. If empty string provided, error handling - provide team name

### 3. Add new redemption to the redemption data if this team is still eligible for redemption, otherwise, do nothing and send the representative away

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.
