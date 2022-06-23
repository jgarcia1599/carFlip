import { action, makeAutoObservable } from "mobx"
import { observer } from "mobx-react"

// Model the application state.
class Model {
    numBlock = 10;
        // We store multiple things in Dapp's state.
    // You don't need to follow this pattern, but it's an useful example.
    currentPage = "token";
    constructor() {
        makeAutoObservable(this, {changePage:action})

    }

    changePage(pageName){
        this.currentPage = pageName;
        console.log("page name", this.currentPage)
    }
}

const model = new Model()
export default model;