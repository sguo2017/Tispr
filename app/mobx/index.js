import {observable} from 'mobx'

class RootStore {
    @observable barStyle = 'light-content'
    @observable user = {}
}
const rootStore = new RootStore()
export default rootStore