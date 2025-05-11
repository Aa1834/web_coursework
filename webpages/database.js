import sqlite3 from "sqlite3";

const database = new sqlite3.Database("raceTimer.db",sqlite3.OPEN_READWRITE, (error) => {
    if (error){
        return console.error(error.message);
    }
    console.log("Connected to racerTimer database")
});


export async function execute(database,sql){
    return new Promise((resolve,reject)=>{
        database.exec(sql,(error) => {
            if (error){
                reject (error);
            }
            resolve();
        });
    });
}




/*database.run(`
    CREATE TABLE marshals (
        marshal_id INTEGER PRIMARY KEY,
        marshal_count INTEGER NOT NULL,
        marshal_checkpoint VARCHAR(255)
    )
`);


database.run(`CREATE TABLE admins(
        admin_id INTEGER PRIMARY KEY,
        admin_name VARCHAR(50),
        admin_role VARCHAR(50)    
    )`);


database.run(
    `CREATE TABLE racers(
        entry_id INTEGER PRIMARY KEY,
        racer_id INTEGER NOT NULL,
        racer_time INTEGER NOT NULL,
        
    )`
) */






