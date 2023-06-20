import { Replicache } from "replicache";
// import { TUTORIAL_LICENSE_KEY } from "./license.js";
import { mutators } from "./mutators";
import { initSpace } from "./space";

const serverURL = "https://replicache-counter.onrender.com";

async function initReplicache() {
    const spaceID = await initSpace(serverURL);
    const rep = new Replicache({
    name: "ruto-health",
    licenseKey: "l8aa5eb53cbf545f1b1f8e2beb25ff955",
      pushURL: `${serverURL}/api/replicache/push?spaceID=${spaceID}`,
      pullURL: `${serverURL}/api/replicache/pull?spaceID=${spaceID}`,
      mutators
    });
  
    // Implements a Replicache poke using Server-Sent Events.
    // If a "poke" message is received, it will pull from the server.
    const ev = new EventSource(
      serverURL + "/api/replicache/poke?spaceID=" + spaceID,
      {
        withCredentials: false
      }
    );
    ev.onmessage = async (event) => {
      if (event.data === "poke") {
        await rep.pull();
      }
    };
  
    const button = document.querySelector("#addition");
    const input = document.querySelector("#input-field");
    const output = document.querySelector("#output");
  
    button.onclick = async () => {
      rep.mutate.createNewRecord(input.value);
    };

    const button1 = document.querySelector("#increment");

    button1.onclick = async () => {
      rep.mutate.increment(1);
    };
  
    rep.subscribe(async (tx) => (await tx.get("value")) ?? 0, {
      onData: (value) => {
        output.textContent = value; 
      }
    });
    rep.subscribe(async (tx) => (await tx.get("count")) ?? 0, {
        onData: (count) => {
          button1.textContent = `Button clicked ${count} times`;
        }
      });
    return rep;
  }
  
  const repPromise = initReplicache();
  module.hot.dispose(async () => {
    (await repPromise).close();
  });