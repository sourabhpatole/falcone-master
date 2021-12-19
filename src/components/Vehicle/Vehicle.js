import React, { Component } from "react"
import "../Planet/Planet.css"
export class Vehicle extends Component {
    onDragStart(e, vehicle) {
        e.dataTransfer.setData("vehicle", JSON.stringify(vehicle))
    }
    onDragOver(e) {
        e.preventDefault()
    }

    onDrop(e) {
        this.props.onDropVehicle(e)
    }

    render() {
        let item = null
        if (this.props.empty) {
            item = (
                <>
                    <div
                        className='box icon'
                        id={this.props.id}
                        onDragOver={e => {
                            this.onDragOver(e)
                        }}
                        onDrop={e => {
                            this.onDrop(e)
                        }}
                    >
                        <i className='small icon plus' />
                    </div>
                </>
            )
        } else {
            item = (
                <>
                    <img
                        draggable
                        onDragStart={e =>
                            this.onDragStart(e, {
                                name: this.props.name,
                                total_no: 1,
                                max_distance: this.props.max_distance,
                                speed: this.props.speed
                            })
                        }
                        className='ui tiny avatar image'
                        src={`/assets/${this.props.name.toLowerCase()}.png`}
                        alt=''
                    />
                    <div className='item-content'>
                        <div className='header'>
                            {this.props.name} X {this.props.total_no}
                        </div>
                            Max Distance = {this.props.max_distance} megamiles
                            <br/>
                        Speed = {this.props.speed} megamiles/hour
                    </div>
                </>
            )
        }
        return (
            <>
                <div className={this.props.empty?'item empty-list' : 'item'}>{item}</div>
            </>
        )
    }
}

export default Vehicle
