import React, { Component } from "react"
import "./Planet.css"
export class Planet extends Component {
    onDragStart(e, planet) {
        e.dataTransfer.setData("planet", JSON.stringify(planet))
    }
    onDragOver(e) {
        e.preventDefault()
    }

    onDrop(e) {
        this.props.onDropPlanet(e)
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
                                distance: this.props.distance
                            })
                        }
                        className='ui tiny avatar image'
                        src={`/assets/${this.props.name.toLowerCase()}.png`}
                        alt=''
                    />
                    <br/>
                    <div className='item-content'>
                        <div className='header'>{this.props.name}</div>
                        Distance - {this.props.distance} megamiles
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

export default Planet
