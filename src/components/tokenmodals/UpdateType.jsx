import React, { useState } from 'react';
import { useMoralis } from "react-moralis";

function UpdateType({ address, render }) {
    const { Moralis } = useMoralis();
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState();

    const updateType = async () => {
        const tokens = Moralis.Object.extend("Tokens");
        const query = new Moralis.Query(tokens);
        query.equalTo("Address", `${address}`);
        const updateToken = await query.first();
        updateToken.set("Type", type);
        await updateToken.save();
        return updateToken.then(render().then(() => setIsOpen(false)));
    };


    return (
        <div>
            <button
                style={{
                    backgroundColor: "lime",
                    margin: "5px",
                    float: "right",
                    borderRadius: "0.5rem",
                    border: "3px solid black",
                }}
                onClick={() => setIsOpen(true)}
            >
                Update Type
            </button>
            {!isOpen ? null :
                <div
                    style={{
                        borderRadius: ".5rem",
                        border: "2px black solid",
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "#202020",
                        padding: "50px",
                        zIndex: 1000,
                    }}>
                    <span style={{ color: "#909090" }}>Token's are classified as Security, Utilities, Payment, or Stablecoin. For more information on types please vist our <a style={{ color: "lime" }} href="/">Company Page</a> for further details.</span>
                    <input
                        type="text"
                        placeholder="Token Type"
                        style={{
                            width: "95%",
                            margin: "15px auto",
                            backgroundColor: "black",
                            color: "lightGray",
                        }}
                        onChange={(e) => setType(e.target.value)}
                    />
                    <button
                        style={{
                            backgroundColor: "lime",
                            margin: "5px",
                            float: "left",
                            borderRadius: "0.5rem",
                            border: "3px solid black",
                        }}
                        type="button" onClick={updateType}>Update</button>
                    <button
                        style={{
                            backgroundColor: "lime",
                            margin: "5px",
                            float: "right",
                            borderRadius: "0.5rem",
                            border: "3px solid black",
                        }} type="cancel" onClick={() => setIsOpen(false)}>Cancel</button>
                </div>
            }
        </div>
    );
}

export default UpdateType