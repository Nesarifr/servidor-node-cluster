import fs from 'fs';
import { faker } from '@faker-js/faker';
faker.setLocale('es')

class ContenedorArchivo{
    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo;
        this.url=`./src/DB/${this.nombreArchivo}.txt` 
    }
    
    // save(Object): Number - Recibe un producto, lo guarda en el archivo, devuelve el id asignado.
    async save(newElement){ 
        try{
            if(fs.existsSync(this.url)){ //si es que existe el archivo ====>>>
                const listElements = await fs.promises.readFile(this.url,"utf-8")
                if(listElements){ //si hay contendio en el archivo
                    const arrayElements =JSON.parse(listElements)
                    const ultimoID= await this.lastID()
                    console.log(ultimoID);
                    const newListElements={ ...newElement, id:ultimoID+1}
                    arrayElements.push(newListElements)
                    await fs.promises.writeFile(this.url, JSON.stringify(arrayElements, null, 2))
                    return newListElements.id  //retorno el ID solicitado
                }else{// no hay contenido
                    const newListElements={ ...newElement, id:1}
                    await fs.promises.writeFile(this.url, JSON.stringify([newListElements], null, 2))
                    return newListElements.id  //retorno el ID solicitado
                }
            }else{ //no existe el archivo , por lo tanto es el primer elemento
                const newListElements={ ...newElement, id:1}
                await fs.promises.writeFile(this.url, JSON.stringify([newListElements], null, 2))
                return newListElements.id  //retorno el ID solicitado
            } 
        } catch(err) {
            console.log(err)
        }
    }

    // getById(Number): Product -  Recibe un id y devuelve el producto con ese id, o null si no está.
    async getById(ID){
        try{
            const numeroID=parseInt(ID)
            if(fs.existsSync(this.url)){
                const listElements = await fs.promises.readFile(this.url,"utf-8")
                if(listElements){ //si hay contendio en el archivo
                    const arrayElements = JSON.parse(listElements)//obtengo todos los elementos del array del archivo
                    const elementFind = arrayElements.find(({id})=>id==numeroID)
                    if(elementFind){
                        return elementFind
                    }else return null
                } else return null
            } else return null
        }
        catch(err){
            return `No existe el ID ${numeroID} solicitado o ya fue borrado`
        }
    }

    // getAll(): arrayProducts[] - Devuelve un array con los objetos presentes en el archivo. En caso de que no haya objetos, ret
    async getAll(){
        try {

            const listElements = await fs.promises.readFile(this.url,"utf8");
            if(listElements){
                const arrayElements = JSON.parse(listElements);
                return arrayElements
            } else{
                return {error: 'No existe una lista de productos todavia'}
            }
        } catch (error) {
            return {error: 'No existe una lista de productos todavia'}
        }
    }

    async getAllRandom(){
        try {
            const {animal, datatype, image} = faker
            const arrayElementsRandom = [];
            for(let i=0 ; i<5; i++){
                arrayElementsRandom.push({
                    id:datatype.uuid(),
                    title: animal.cat(),
                    price: datatype.number({ min: 10, max: 100}),
                    thumbnail:image.cats(150, 150, true)
                })
            }
            return arrayElementsRandom
        } catch (error) {
            return {error: 'No existe una lista de productos todavia'}
        }
    }

    // deleteById(Number): void - Elimina del archivo el producto con el id buscado.
    async deletedById(ID){
        try {
            const listElements = await fs.promises.readFile(this.url,"utf8");
            const arrayElements = JSON.parse(listElements);
            const arrayFilter= arrayElements.filter(item=>item.id!==ID);
            await fs.promises.writeFile(this.url, JSON.stringify(arrayFilter, null, 2))
        } catch (error) {
            console.log(error)
        }
    }

    // deleteAll(): void - Elimina todos los productos presentes en el archivo.
    async deleteAll(){
        try {
            await fs.promises.writeFile(this.url, JSON.stringify([]));
        } catch (error) {
            console.log(error)
        }
    }

    // acutalizaByID(number: ID , json: productoNew): void - actualiza borrando el producto y agregando el nuevo producto
    async actualizaByID(ID, newElement){
        try{
            let IDparse = parseInt(ID)
            const elementExits=await this.getById(IDparse)
            if(elementExits){
                const arrayElements= await this.getAll()
                let arrayNewElements = []
                if(arrayElements){
                    arrayNewElements = arrayElements.map( obj =>{
                        if(obj.id===IDparse){
                            return {...newElement, id: IDparse}
                        } else return obj
                })} else return null
                await this.deleteAll()
                await fs.promises.writeFile(this.url, JSON.stringify(arrayNewElements, null, 2))
                return {...newElement, id: IDparse}
            }
        } catch(error) {
            console.log(error)
        }
    }

    // lastID(): retorna el ultimo ID
    async lastID(){
        try{
            if(fs.existsSync(this.url)){ //si es que existe el archivo ====>>>
                let ultimoID
                const listElements = await fs.promises.readFile(this.url,"utf-8")
                if(listElements){ //si hay contendio en el archivo
                    const arrayElements = JSON.parse(listElements)
                    ultimoID =arrayElements.reduce(function (acc, item) {
                        if(acc<item.id){
                            return acc=item.id
                        } else { return acc}
                    }, 0)
                } else{ ultimoID = 0 }
                return ultimoID
            }
        }catch{
            return { msj: "No existe el archivo solicitado"}
        }
}
}
/* --------------------------------- exports -------------------------------- */
export {ContenedorArchivo}