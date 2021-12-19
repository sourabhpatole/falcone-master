import React, { Component } from "react"
import "./BaseCamp.css"
import PlanetList from "../PlanetList/PlanetList"
import VehicleList from "../VehicleList/VehicleList"

export class BaseCamp extends Component {
    render() {
        return (
            <div className='outer-container'>
                <div className='ui container fluid inverted segment base-camp'>
                    <PlanetList
                        planets={this.props.basePlanets}
                        onDropPlanet={this.props.onDropPlanet}
                    />
                    <div className="time-taken">
                        <button
                            onClick={() => this.props.fetchResult()}
                            className='circular ui negative massive button'
                        >GO
                        </button>

                        <a className='ui huge label black'>
                            <i className='clock icon' /> Time Taken :{" "}
                            {this.props.time}
                        </a>
                    </div>
                    <VehicleList
                        vehicles={this.props.baseVehicles}
                        onDropVehicle={this.props.onDropVehicle}
                    />
                </div>
            </div>
        )
    }
}

export default BaseCamp
