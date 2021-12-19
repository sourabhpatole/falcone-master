import React, { Component } from "react"
import { Router, Route } from "react-router-dom"
import Header from "./Header/Header"
import Footer from "./Footer/Footer"
import PlanetList from "./PlanetList/PlanetList"
import VehicleList from "./VehicleList/VehicleList"
import BaseCamp from "./BaseCamp/BaseCamp"
import axios from "../apis/index"
import Result from "./Result/Result"
import history from "../history"
import "./App.css"

class App extends Component {
    state = {
        planets: [],

        vehicles: [],

        basePlanets: [
            { id: "Planet_1", empty: true },
            { id: "Planet_2", empty: true },
            { id: "Planet_3", empty: true },
            { id: "Planet_4", empty: true }
        ],

        baseVehicles: [
            { id: "Vehicle_1", empty: true },
            { id: "Vehicle_2", empty: true },
            { id: "Vehicle_3", empty: true },
            { id: "Vehicle_4", empty: true }
        ],

        timeTaken: 0,
        maximum: 4,
        resultStatus: null,
        loader: false
    }

    componentDidMount() {
        axios.get("/planets").then(res => {
            this.setState({ planets: res.data })
        })

        axios.get("/vehicles").then(res => {
            this.setState({ vehicles: res.data })
        })
    }
    calculateTime(index) {
        const planet = this.state.basePlanets[index]
        const vehicle = this.state.baseVehicles[index]
        if (!planet.empty && !vehicle.empty) {
            const timeTaken =
                this.state.timeTaken + planet.distance / vehicle.speed
            this.setState({ timeTaken })
        }
    }
    onDropPlanet = e => {
        let data = e.dataTransfer.getData("planet")
        if (!data) return
        data = JSON.parse(data)
        if (e.target.id && e.target.id.includes("Planet")) {
            let planets = [...this.state.planets]

            let targetIndex = parseInt(e.target.id.substr(-1)) - 1
            let vehicle  = this.state.baseVehicles[targetIndex];

            if(!vehicle.empty && data.distance > vehicle.max_distance){
                alert("Vehicle Max Distance is less than Planet's Distance")
                return
            }
            planets = planets.filter(planet => {
                return planet.name !== data.name
            })
            let basePlanets = [...this.state.basePlanets]
            const index = basePlanets.findIndex(item => {
                return item.id === e.target.id
            })

            basePlanets.splice(index, 1, data)
            this.setState(
                { planets: planets, basePlanets: basePlanets },
                () => {
                    this.calculateTime(index)
                }
            )
        }
    }

    onDropVehicle = e => {
        let data = e.dataTransfer.getData("vehicle")
        if (!data) return
        data = JSON.parse(data)

        if (e.target.id && e.target.id.includes("Vehicle")) {            
            let vehicles = [...this.state.vehicles]
            
            let targetIndex = parseInt(e.target.id.substr(-1)) - 1
            let planet  = this.state.basePlanets[targetIndex];

            if(!planet.empty && data.max_distance < planet.distance){
                alert("Vehicle Max Distance is less than Planet's Distance")
                return
            }

            let index = vehicles.findIndex(
                vehicle => vehicle.name === data.name
            )
            if (vehicles[index].total_no > 1) {
                vehicles[index].total_no -= 1
            } else {
                vehicles.splice(index, 1)
            }

            let baseVehicles = [...this.state.baseVehicles]
            index = baseVehicles.findIndex(item => item.id === e.target.id)
            baseVehicles.splice(index, 1, data)
            this.setState({ vehicles, baseVehicles }, () => {
                this.calculateTime(index)
            })
        }
    }
    resetState = () => {
        let basePlanets = [...this.state.basePlanets]
        let baseVehicles = [...this.state.baseVehicles]
        let planets = [...this.state.planets]
        let vehicles = [...this.state.vehicles]

        for (let i = 0; i < basePlanets.length; i++) {
            if (!basePlanets[i].empty) {
                planets.push(basePlanets[i])
                basePlanets.splice(i, 1, {
                    id: `Planet_${i}`,
                    empty: true
                })
            }
            if (!baseVehicles[i].empty) {
                let index = vehicles.findIndex(
                    vehicle => vehicle.name === baseVehicles[i].name
                )
                if (index > -1) {
                    vehicles[index].total_no += 1
                } else {
                    vehicles.push(baseVehicles[i])
                }
                baseVehicles.splice(i, 1, {
                    id: `Vehicle_${i}`,
                    empty: true
                })
            }
        }

        this.setState({
            planets,
            vehicles,
            basePlanets,
            baseVehicles,
            timeTaken: 0
        })
    }

    fetchResult = () => {
        let planet_names = this.state.basePlanets.map(planet => planet.name)

        let vehicle_names = this.state.baseVehicles.map(vehicle => vehicle.name)

        if (
            planet_names.includes(undefined) ||
            vehicle_names.includes(undefined)
        ) {
            alert("Please select all Planets and Vehicles !")
            return
        }

        this.setState({ loader: true })
        let token = ""
        axios
            .post("/token", "", {
                headers: {
                    Accept: "application/json"
                }
            })
            .then(res => {
                token = res.data.token
                let body = {
                    token,
                    planet_names,
                    vehicle_names
                }

                axios
                    .post("/find", body, {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json"
                        }
                    })
                    .then(res => {
                        if (res.data.status) {
                            this.setState({ resultStatus: res.data }, () => {
                                this.setState({ loader: false })
                                history.push("/result")
                            })
                        } else {
                            this.setState({ loader: false })
                            alert("Token not initialized !")
                        }
                    })
            })
    }
    render() {
        return (
            <div>
                <Header resetState={this.resetState} />

                <Router history={history}>
                    <div>
                        <Route
                            path='/result'
                            exact
                            component={() => (
                                <Result
                                    resultStatus={this.state.resultStatus}
                                    timeTaken={this.state.timeTaken}
                                    resetState={this.resetState}
                                />
                            )}
                        />
                        <Route
                            path='/'
                            exact
                            component={() => {
                                return (
                                    <>
                                        {this.state.loader ? (
                                            <div className='loader'>
                                                <img
                                                    src='/assets/loader.gif'
                                                    alt='loader'
                                                />
                                            </div>
                                        ) : (
                                            ""
                                        )}

                                        <PlanetList
                                            planets={this.state.planets}
                                        />

                                        <BaseCamp
                                            basePlanets={this.state.basePlanets}
                                            onDropPlanet={this.onDropPlanet}
                                            baseVehicles={
                                                this.state.baseVehicles
                                            }
                                            onDropVehicle={this.onDropVehicle}
                                            time={this.state.timeTaken}
                                            fetchResult={this.fetchResult}
                                        />

                                        <VehicleList
                                            vehicles={this.state.vehicles}
                                        />
                                    </>
                                )
                            }}
                        />
                    </div>
                </Router>
                <Footer />
            </div>
        )
    }
}

export default App
