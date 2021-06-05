import React, { useState } from 'react';
import { useParams, useLocation, Redirect } from 'react-router-dom';
import Errors from '../Errors/Errors';
import Header from '../Header';

export default function AddEditStagePage(props) {
    // Set initial form state and page type based on info passed from referrer
    const location = useLocation();
    const { applicationID, initialValues, requestMethod, endpoint } = location.state;

    console.log(`The applicationID is ${applicationID}`);
    console.log(`The initial values are ${JSON.stringify(initialValues)}`);
    console.log(`The request method is ${requestMethod}`);
    console.log(`The endpoint is ${endpoint}`);

    const [formValues, setFormValues] = useState(initialValues);
    const [redirectBack, setRedirectBack] = useState(false);

    //update state for specific field
    const handleChange = (event) => {
      let field = event.target.name; //which input
      let value = event.target.value; //what value

      let copy = {...formValues}
      copy[field] = value //change this field
      setFormValues(copy)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Convert duration into an integer before submitting
        let sendData = {...formValues};
        sendData.durationMins = parseInt(sendData.durationMins);
        console.log(`The data to be sent is ${JSON.stringify(sendData)}`);

        const response = await fetch(endpoint, {
            method: requestMethod,
            body: JSON.stringify(sendData),
            headers: new Headers({
                "Authorization": localStorage.getItem("Authorization"),
                "Content-Type": "application/json",
            })
        });
        if (response.status >= 300) {
            const error = await response.text();
            //this.setError(error);
            return;
        }
        //this.setError("");
        const newStage = await response.json();
        setRedirectBack(true); // redirect back to application page
    }

    const StageTypes = [
        'Take Home',
        'Online Assessment',
        'Phone Screen',
        'Onsite',
        'Team Matching'
    ]
    const stageTypeFormOptions = StageTypes.map((stageType) => {
        return <option key={stageType}>{stageType}</option>
    })

    if (redirectBack) {
        return <Redirect to={`/applications/${applicationID}`} />
    } else {
        return <>
            <Header {...props} />
            <div className="container px-5">
                <h2>Add Stage</h2>
                <form>
                    {/* stageType */}
                    <div className="form-group">
                        <label htmlFor="stagetype">Stage Type</label>
                        <select className="form-control"
                            id="stagetype"
                            name="stageType"
                            value={formValues.stageType || StageTypes[0]}
                            onChange={handleChange}
                            >
                                { stageTypeFormOptions }
                        </select>
                    </div>

                    {/* stageDate */}
                    <div className="form-group">
                        <label htmlFor="stagedate">Date</label>
                        <input className="form-control"
                            id="stagedate"
                            type="date"
                            name="stageDate"
                            value={formValues.stageDate ? new Date(formValues.stageDate).toISOString().substr(0,10) : formValues.stageDate}
                            onChange={handleChange}
                            />
                    </div>

                    {/* durationMins */}
                    <div className="form-group">
                    <label htmlFor="duration">Duration (Minutes)</label>
                    <input className="form-control"
                        id="duration"
                        type="number"
                        name="durationMins"
                        value={formValues.durationMins}
                        onChange={handleChange}
                        />
                    </div>

                    {/* notes */}
                    <div className="form-group">
                        <label htmlFor="notes">Notes</label>
                        <textarea className="form-control"
                            id="notes"
                            name="notes"
                            value={formValues.notes}
                            onChange={handleChange}
                            />
                    </div>

                    {/* buttons */}
                    <div className="form-group">
                        <button className="btn btn-primary mr-2" onClick={handleSubmit}>Submit</button>
                    </div>
                </form>
            </div>
        </>
    }
}

