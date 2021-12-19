import React, { Component } from "react"
import history from "../../history"
import './Result.css'
export class Result extends Component {
    navigate = () => {
        this.props.resetState()
        history.push("/")
    }

    render() {
        let result = null
        if (this.props.resultStatus === null) {
            result = <div>No Result Found. Start a new Mission.</div>
        } else if (this.props.resultStatus.status === "false") {
            result = <div>Mission Failed ! Don't Loose Hope. Try Again.</div>
        } else {
            result = (
                <div>
                    Mission Success! Congratulations on Finding Falcone. Sourabh
                    is mighty Pleased.
                    <br />
                    Time Taken : {this.props.timeTaken}
                    <br />
                    Planet Found: <u>{this.props.resultStatus.planet_name}</u>
                </div>
            )
        }
        return (
            <div className='ui inverted segment' style={{"height":"90vh"}}>
                <div className="content">
                <div className="content-description">
                    {result}
                    </div>
                    <button
                        onClick={this.navigate}
                        className='ui massive button'
                    >
                        Start Again
                    </button>
                </div>
            </div>
        )
    }
}

export default Result
