import Express  from "express";
import {fork} from "child_process";

export const routerRandom = Express.Router();

routerRandom.use(Express.json());
routerRandom.use(Express.urlencoded({extended: true}))

routerRandom.get('/', async (req, res)=>{
    try{
        const child = fork("./src/helpers/child.js");
        child.on("message", (childMsj)=>{
            if (childMsj==="listo"){
                console.log(req.query);
                child.send(req.query.cant)
            }
            else{
                res.json({resultado:childMsj})
            }
        })
    }
    catch(error){
        res.status(500).send('Error en el servidor')
    }
})

export default {routerRandom}
