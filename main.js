const CHAT_INPUT = document.getElementById('c_input');
const CHAT_CONTAINER = document.getElementById('c_container');
const MSG_TEMPLATE = document.getElementById('message_template');
const alphabet = [...'abcdefghijklmnopqrstuvwxyz'];

let scanningQueue = []; // Queue to process messages one at a time


CHAT_INPUT.addEventListener('keyup', async (e)=>{
    const text = CHAT_INPUT.value;
    if (e.key !== 'Enter' || text.trim() === '') return;

    const msgElement = prepareMessage(text, 'message--outgoing'); // Add 'outgoing' by default
    CHAT_CONTAINER.appendChild(msgElement); // Insert into the DOM
    CHAT_INPUT.value = ''; // Clear the input after sending

    // Add to the queue and start scanning if not already processing
    scanningQueue.push(CHAT_CONTAINER.lastElementChild);
    if (scanningQueue.length === 1) await processQueue();
})

async function processQueue() {
    while (scanningQueue.length > 0) {
        const currentMessage = scanningQueue[0];
        await startScan(currentMessage); // Wait for the current message to finish scanning
        scanningQueue.shift(); // Remove processed message from the queue
    }
}

function prepareMessage(content, type = 'outgoing') {
    const clone = MSG_TEMPLATE.content.cloneNode(true);
    const messageSpan = clone.querySelector('.message');
    messageSpan.textContent = content;
    messageSpan.classList.add(type); // Add the specified class
    return clone;
}

async function startScan(messageNode) {
    splitUpMsg(messageNode);          // Split message text into individual <x-c> characters
    await scanMessage(messageNode);         // Start the animation scan
}

function splitUpMsg(messageNode) {
    // Replace text with individual <x-c> elements for each character
    let htmlString = messageNode.innerHTML = messageNode.textContent.trim().split("").map(char => {
        if (char === " ") return "</x-w>&#32;<x-w>"
        return `<x-c>${char}</x-c>`;
    }).join(""); // Join array into a single string
    htmlString = "<x-w>" + htmlString + "</x-w>";
    messageNode.innerHTML = htmlString;
}

function scanMessage(messageNode) {
    const words = Array.from(messageNode.querySelectorAll('x-w'));
    let animPosition = 0;
    const animDelayMs = 40;

    return new Promise(resolve => {
        words.forEach((word) => {
            const chars = Array.from(word.querySelectorAll('x-c'));
    
            chars.forEach((charNode) => {
                setTimeout(() => { // Temporary highlight for scanning
                    charNode.classList.add('highlight'); 
                    setTimeout(() => charNode.classList.remove('highlight'), 100);
                }, ++animPosition * animDelayMs); // Delay for each character
            });
    
            const cleanWord = word.textContent.trim().split("").filter(c=>alphabet.includes(c)).join("")
    
            if (flaggedWords.includes(cleanWord)) {
                setTimeout(()=>highlightWord(word), animPosition * animDelayMs);
            }
        })
        
        setTimeout(()=>{resolve("scanned")}, animPosition*animDelayMs) 
        messageNode.classList.add("message--scanned")
    })


}

function highlightWord(word) {
    word.classList.add('permanent-highlight');
}


const flaggedWords = [
    "bombe", "explosion", "terror", "attentat", "anschlag", "kriegswaffe", "militär", 
    "sprengstoff", "waffe", "amoklauf", "rakete", "drogen", "heroin", "kokain", 
    "meth", "betäubungsmittel", "waffenhandel", "illegal", "nuklear", "kriegsverbrechen", 
    "schießen", "anschlagsplan", "gifte", "vergiftung", "chemiewaffe", "spionage", 
    "kinderpornographie", "pornographie", "darknet", "kinderhandel", "menschenhandel", 
    "entführung", "kidnapping", "vergewaltigung", "schmuggel", "geldwäsche", "korruption", 
    "hacken", "cyberangriff", "trojaner", "malware", "phishing", "identity-theft", 
    "sexuelle-ausbeutung", "gewalt", "falschgeld", "erpressung", "schwarzmarkt", 
    "schießerei", "schusswaffe", "tötung", "mord", "beweisvernichtung", "folter", 
    "anarchie", "aufstand", "revolte", "destabilisierung", "verrat", "rebellion", 
    "hochverrat", "verfassungswidrig", "extremismus", "islamismus", "radikalisierung", 
    "nazismus", "fremdenfeindlichkeit", "rassismus", "antisemitismus", "nationalismus", 
    "rechtsextrem", "linksextrem", "faschismus", "rechtsterrorismus", "linksterrorismus", 
    "protest", "gewalttat", "verbrechen", "beleidigung", "bedrohung", "manipulation", 
    "völkermord", "genozid", "gewaltsam", "erschießen", "schlägerei", "übergriff", 
    "entwaffnen", "betrug", "schmieren", "kompromittieren", "aufwiegeln", "terrorzelle", 
    "schutzgelderpressung", "vertrauenbruch", "spion", "verleumdung", "diffamierung", 
    "geschäftsschädigung", "veruntreuung", "übergabe", "infiltration", "anschlagsziel", 
    "todesdrohung", "bedrohlich", "verdächtig", "extrem", "illegalität", "kriminell", 
    "verhaften", "festnahme", "haftbefehl", "überwachung", "späh", "beobachten", 
    "nachrichtendienst", "verdeckter", "intelligenzoperation", "staatsfeind", "feindlich", 
    "gegenregierung", "staatsgeheimnis", "umsturz", "aufwiegelung", "aufsicht", "übergriff", 
    "opfer", "machtkampf", "entgleisung", "flucht", "asyl", "grenzüberschreitung", 
    "illegaler", "unsichere-handel", "verstörung", "schießerei", "angriff", "freizeitwaffe", 
    "illegaler-handel", "hochverrat", "verschwörung", "extremismus", "kriegsführung", 
    "missbrauch", "illegalität", "kinderpornographie", "pornografie", "sklavenhandel", 
    "heirat", "treuebruch", "lüge", "partei", "national", "staatsfeindlich", "demokratiefeindlich",
    "demo", "demonstration", "schmuggeln"
];


scanningQueue = [... document.querySelectorAll('.message:not(.message--scanned)')] 
processQueue();
