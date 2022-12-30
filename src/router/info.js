import Express  from "express";

export const routerInfo = Express.Router();

routerInfo.use(Express.json());
routerInfo.use(Express.urlencoded({extended: true}))

routerInfo.get('/', async (req, res)=>{
    try{
        const info = {
            Argumentos: process.env.argv,
            OS: process.env.OS,
            VersionNode: process.versions.node,
            MemoriaReservada: process.memoryUsage().rss,
            PathEjecut: process.execPath,
            ProcessId: process.pid,
            Proyecto: process.cwd()
        }

        res.json(info)
    }
    catch(error){

        res.status(500).send('Error en el servidor')

    }
})

export default {routerInfo}
