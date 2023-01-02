import axios from "axios";

class DataService {

    static ACCESS_DATA = {
        "dataSource": "Cluster0",
        "database": "sacrament-bread",
        "collection": "weeks"
    };


    static API_KEY = '63b10590969f06502871a807';

    static FIND_URL = 'https://sacramentbread-d062.restdb.io/rest/weeks';
    static FIND_BY_ID_URL = 'https://sacramentbread-d062.restdb.io/rest/weeks/ID';
    static INSERT_MANY_URL = 'https://sacramentbread-d062.restdb.io/rest/weeks';
    static UPDATE_ONE_URL = 'https://sacramentbread-d062.restdb.io/rest/weeks/';


    static async fetchSchedule() {
        return axios.get(this.FIND_URL, { headers: { 'x-apikey': this.API_KEY } })
            .then(response => {
                const data = response.data;
                return data;
            }).catch(err => {
                console.error(`err: ${err}`);
            })
    }

    static async updateWeek(week) {
        const url = this.UPDATE_ONE_URL + week._id;
        return axios.put(url, week, { headers: { 'x-apikey': this.API_KEY } })
            .then(response => {
                const data = response.data;
                return data;
            }).catch(err => {
                console.error(`err: ${err}`);
            })
    }

}

export default DataService;