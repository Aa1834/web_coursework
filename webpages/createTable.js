import sqlite3 from "sqlite3"
import {execute} from './database.js'

async function main(){
    const database = new sqlite3.Database('raceTimer.db');
    try{
        await execute(
            database, `CREATE TABLE IF NOT EXISTS RaceTime(
            time_table_key INTEGER PRIMARY KEY AUTOINCREMENT,
            admin_id INTEGER NOT NULL,
            admin_name VARCHAR(255),
            admin_role VARCHAR(50),
            positions INTEGER NOT NULL,
            race_time VARCHAR(255) NOT NULL
            );`
        );

        await execute(database, `CREATE TABLE IF NOT EXISTS RaceNumbers(
            position_table_key INTEGER PRIMARY KEY AUTOINCREMENT,
            admin_id INTEGER NOT NULL,
            admin_name VARCHAR(255),
            admin_role VARCHAR(50),
            position INTEGER NOT NULL,
            racer_id INTEGER
            )`);


        await execute(database, `CREATE TABLE IF NOT EXISTS Marshals(
            marshal_table_key INTEGER PRIMARY KEY AUTOINCREMENT,
            marshal_id INTEGER,
            checkpoint VARCHAR(255),
            count INTEGER
            )`)
        console.log("Successfully created tables.");

    }
    catch(error){
        console.log("ERROR OCCURED",error.message);
    }
    finally{
        database.close()
    }
    
    
}



main()


