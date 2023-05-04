import {Sequelize} from 'sequelize';
import * as winston from 'winston';
import {getEnvOptions} from '../env/envreader'

//let envopts;

let envopts =  getEnvOptions();    


export const seq = new Sequelize(envopts.databasename,envopts.databaseusername,envopts.databasepassword,{
    dialect: 'mariadb',
    port: 3390,
    logging: (msg,obj) => logDb(msg,obj),
    pool : {
        max: 1,

    }
});



const dblogger = winston.createLogger({
    transports: [
        new winston.transports.File({filename:'database.log'})
    ]
})

function logDb(param:any,obj:any){
    // TODO separate ERROR logs?
    dblogger.log("info",param + obj.bind);
}



// TODO alter danger prod
//seq.sync({alter:true, force: true});

