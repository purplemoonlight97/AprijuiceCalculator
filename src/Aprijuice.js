import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById("root"));

//Details of the five colors of apricorns in relation to aprijuice
const colorDetails = [
  {
    color: "red",
    flavor: "spicy",
    stat: "power",
    add: 0,
    sub: 1,
    src: "./images/red.png",
  },
  {
    color: "yellow",
    flavor: "sour",
    stat: "stamina",
    add: 1,
    sub: 2,
    src: "./images/yellow.png",
  },
  {
    color: "blue",
    flavor: "dry",
    stat: "skill",
    add: 2,
    sub: 3,
    src: "./images/blue.png",
  },
  {
    color: "green",
    flavor: "bitter",
    stat: "jump",
    add: 3,
    sub: 4,
    src: "./images/green.png",
  },
  {
    color: "pink",
    flavor: "sweet",
    stat: "speed",
    add: 4,
    sub: 0,
    src: "./images/pink.png",
  },
  {
    color: "black",
    src: "./images/black.png",
  },
  {
    color: "white",
    src: "./images/white.png",
  }
];

//function for when an apricorn is added or removed from the chain
const handleApricorn = (index, flavors) => {
  const nextFlavors = flavors.map((f, i) => {
      
  if(colorDetails[index].color === "black"){ //black adds 2 to all flavors
    if (f <= 61){
      return f + 2;
    }
    return 63; //max is 63 in a flavor
  } else if(i === colorDetails[index].add){ //colors besides black and white add 4 to a single flavor
    if (f <= 59){
       return f + 4;
    } 
    return 63; //max is 63
  } else if (i === colorDetails[index].sub || colorDetails[index].color === "white"){ //colors subtract one from a single flavor; black subtracts 2 from all flavors
    if (f >= 2){
       return f - 2;
    }
    return 0; //min is 0 in a flavor
  } else {
    return f;
  }
  });

  //the flavors have to be totaled. 100 is the max combined
  let sum = 0;
  nextFlavors.forEach(element => {
    sum += element;
  });

  if (sum > 100){//max is 100
    let biggest = Math.max(...nextFlavors); //to get back to 100 total, the strongest flavor has to be weakened
    if (nextFlavors.indexOf(biggest) === index){ //however, it ignores the strongest if it was the one just raised
      const tempFlavors = nextFlavors.map((f, i) => {
        if (i === colorDetails[index].add){
          return 0;
        }
        return f;
      });
      biggest = Math.max(...tempFlavors);
    }
    //black reduces a random color among the strongest flavors
    //the normal tie breaker of other colors is just to take the first in order
    //black in this program continues this trend
    //however, in game it COULD pick a different flavor.
    //alert the user if this occurs
    if (colorDetails[index].color === "black"){
      let foundAlert = false;
      nextFlavors.forEach((d, i) => {
        if (nextFlavors[nextFlavors.indexOf(biggest)] === d && nextFlavors.indexOf(biggest) !== i && foundAlert === false){
          alert("Using a black apricorn when there are two equal largest flavor values introduces randomness. The calculator may produce a different result than your game.");
          foundAlert = true;
        }
      });
    }
    nextFlavors[nextFlavors.indexOf(biggest)] += 100 - sum;
  }
  return nextFlavors;
};

//buttons for adding an apricorn to the chain
const ApriButton = (props) => {
  
  const handleClick = () => {
    props.setApricorns([...props.apricorns, props.index]);
    props.setFlavors(handleApricorn(props.index, props.flavors));
  };
  
  return(
    <button className="apributton" type="button" onClick={handleClick}>
      <img 
        src={colorDetails[props.index].src} 
        alt={colorDetails[props.index].color} 
        height='40' 
        width='40'
        className='apributtonImg' 
      />
    </button>
  )
};

//reset the program back to default
//saves the chain of apricorns temporarily so that it can be undone
const ResetButton = (props) => {

  const handleClick = () => {
    props.setLastApricorns(props.apricorns);
    props.setApricorns([]);
    props.setFlavors([0, 0, 0, 0 , 0]);
  }

  return(
    <button type='button' onClick={handleClick} className='otherButton'>
      Reset
    </button>
  )
}

//removes the last apricorn added
//if the chain is empty, it will pull the temporarily held chain
const UndoButton = (props) => {
  const handleClick = () => {
    let tempApricorns = [...props.apricorns];
    let tempFlavors = [0, 0, 0 , 0, 0];
    if(tempApricorns.pop() == null){
      tempApricorns = [...props.lastApricorns];
      props.setLastApricorns([]);
    }
    props.setApricorns(tempApricorns);
    tempApricorns.forEach(e => tempFlavors = [...handleApricorn(e, tempFlavors)]);
    props.setFlavors(tempFlavors);
  }

  return(
    <button type='button' onClick={handleClick} className='otherButton'>
      Undo
    </button>
  )
};


//construct the application
const App = () => {
  const [flavors, setFlavors] = useState([0, 0, 0, 0, 0]);
  const [apricorns, setApricorns] = useState([]);
  const [lastApricorns, setLastApricorns] = useState([]);
  const [mildness, setMildness] = useState(0);

  let apricornImagesHTML = '';
  let outputHTML = `This drink will have a flavor profile of `;
  let largest, secondLargest, smallest = 0;
  const holdFlavors = [...flavors];
  const reversedHoldFlavors = [...flavors].reverse();

  //prevents mildness from being less than 0 or larger than 255
  const handleChange = (event) => {
    let holdMildness = event.target.value;
    if (holdMildness > 255){
      holdMildness = 255;
    } else if (holdMildness < 0){
      holdMildness = 0;
    }
    setMildness(holdMildness);
  };

  apricorns.forEach((e, i) => {
    apricornImagesHTML += `<img 
        src="${colorDetails[e].src}"
        alt="${colorDetails[e].color}"
        height='30' 
        width='30'
      />`;
  });

  //adds the flavors to the output
  flavors.forEach((e, i) => {
    outputHTML += `<b>${colorDetails[i].flavor}</b>: ${e}, `
  });
  //removes the last comma and space and adds a period.
  outputHTML = outputHTML.substring(0, outputHTML.length-2) + '.<br /><br /><hr /><br />';

  //calculates the weakest and two strongest flavors.
  //the other three flavors do not affect the stats of the pokemon.
  smallest = reversedHoldFlavors.indexOf(Math.min(...holdFlavors));
  largest = holdFlavors.indexOf(Math.max(...holdFlavors));
  holdFlavors[largest] = -1;
  secondLargest = holdFlavors.indexOf(Math.max(...holdFlavors));

  //get how much the weakness will be
  let penalty = 0;
  if (mildness < 200){
    penalty = Math.floor((1 - (Math.floor(mildness/25) * 0.1)) * (flavors[largest] + flavors[secondLargest]));
  } else if (mildness < 255){
    penalty = Math.floor(0.2 * (flavors[largest] + flavors[secondLargest]));
  } else{
    penalty = Math.floor(0.1 * (flavors[largest] + flavors[secondLargest]));
  }

  outputHTML += `This will increase <b>${colorDetails[largest].stat}</b> by ${apricorns.length === 0 ? 0 : Math.floor(flavors[largest] * 1.5) + 10},
                increase <b>${colorDetails[secondLargest].stat}</b> by ${Math.floor(flavors[secondLargest] * 1.5)},  
                and decrease <b>${[...colorDetails].splice(0, 5).reverse()[smallest].stat}</b> by ${penalty}.`;

  outputHTML = apricorns.length === 0 ? "" : outputHTML;
  
  document.getElementById("displayApricorns").innerHTML = apricornImagesHTML;
  document.getElementById("output").innerHTML = outputHTML;

  return(
    <div>
      <div id="apriButtons">
        <ApriButton flavors={flavors} setFlavors={setFlavors} apricorns={apricorns} setApricorns={setApricorns} index={0} />
        <ApriButton flavors={flavors} setFlavors={setFlavors} apricorns={apricorns} setApricorns={setApricorns} index={1} />
        <ApriButton flavors={flavors} setFlavors={setFlavors} apricorns={apricorns} setApricorns={setApricorns} index={2} />
        <ApriButton flavors={flavors} setFlavors={setFlavors} apricorns={apricorns} setApricorns={setApricorns} index={3} />
        <ApriButton flavors={flavors} setFlavors={setFlavors} apricorns={apricorns} setApricorns={setApricorns} index={4} />
        <ApriButton flavors={flavors} setFlavors={setFlavors} apricorns={apricorns} setApricorns={setApricorns} index={5} />
        <ApriButton flavors={flavors} setFlavors={setFlavors} apricorns={apricorns} setApricorns={setApricorns} index={6} />
      </div>
      <div id="mildnessDiv">
        <span>Mildness: </span>
        <input 
          id="mildness" 
          type='number' 
          value={mildness} 
          onChange={handleChange} 
          onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
        />
      </div>
      <div id="otherButtons">
        <ResetButton setFlavors={setFlavors} apricorns={apricorns} setApricorns={setApricorns} setLastApricorns={setLastApricorns}/>
        <UndoButton flavors={flavors} setFlavors={setFlavors} apricorns={apricorns} setApricorns={setApricorns} lastApricorns={lastApricorns} setLastApricorns={setLastApricorns}/>
      </div>
    </div>
  )
}

root.render(
  <App />
);