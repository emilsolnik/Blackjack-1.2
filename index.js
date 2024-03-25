import { deck } from "./data1.js"
let cardsUser = []
let cardsDealer =[]
let sumUser  = 0
let sumDealer = 0
let hasBlackjack = false 
let isAlive = true
let message = ""  
const messageEl = document.getElementById("message-el")
const sumEl = document.getElementById("sum-el")
let playerEl = document.getElementById("player-el")
const startGameBtn = document.getElementById("startbutton")
const newCardBtn = document.getElementById("newcard")
const cardImg = document.getElementById("card-img")
const dealerCardImg = document.getElementById("dealer-cards")
const dealerSum = document.getElementById("dealerSum")
const playBtns = document.getElementById("btns")
const holdBtn = document.getElementById("hold-btn")
const signUp = document.getElementById("sign-up")

signUp.addEventListener('submit', function(e){
    e.preventDefault()
    signUp.style.display='none'
    const signUpData = new FormData(signUp)
    const fullName = signUpData.get('fullName')
    let player={
        name: fullName,
        chips : 150
    }
    const theme = document.querySelector('input[type="radio"]:checked').value
    const dealerImg = document.getElementById("dealerImg")
    let dealer='dealer'
    let liveDeck = [...deck]
    playerEl.textContent = player.name + " : $" +player.chips
    startGameBtn.addEventListener("click",startGame)
    newCardBtn.addEventListener('click',newCard)
    holdBtn.addEventListener('click',dealerRenderGame)
    function dealerMoney(){
        if(player.chips>150){
            dealer='poor'
        }
        else if(player.chips<150 && player.chips>=0){
            dealer='rich'
        }
        else if(player.chips<0){
            dealer='superRich'
        }
        else{
            dealer='dealer'
        }
        return dealer
    }
    function resetGame(){
        cardsUser=[]
        cardsDealer=[]
        sumUser=0
        sumDealer=0
        liveDeck = [...deck]
        document.getElementById("Blackjack").style.display='none'
        isAlive = true
        hasBlackjack=false
        messageEl.textContent = "" 
        sumEl.textContent = "dealer: "
        dealerSum.textContent="player: "
        deck[0].value=11
        deck[1].value=11
        deck[2].value=11
        deck[3].value=11
        dealerImg.src = `emil/${dealerMoney()}Emil.png`

        
    }
    function startGame(){
        resetGame()
        const firstCard = getRandomCard()
        const secondCard = getRandomCard()
        cardsUser = [firstCard, secondCard]
        const dealerFirstCard =getRandomCard()
        const dealersecondCard =getRandomCard()
        cardsDealer=[dealerFirstCard,dealersecondCard]
        renderGame()

    }

    function getRandomCard(){
        const random = Math.floor(Math.random()*liveDeck.length)
        const currentCard = liveDeck[random]
        liveDeck.splice(random,1)
        return currentCard
        
    }
    function renderGame(){
        cardImg.innerHTML = ""
        dealerCardImg.innerHTML=""
        sumUser=0
        sumDealer=0
        for(let card of cardsUser){
        cardImg.innerHTML += `<img class="card-img" src="cards${theme}/${card.img}"> `
        sumUser+=card.value
        }
            dealerCardImg.innerHTML=`<img class="card-img" src="cards${theme}/${cardsDealer[0].img}">
            <img class="card-img" src="cards${theme}/${cardsDealer[1].backImg}">
            `
            sumDealer=cardsDealer[0].value

        if(sumUser<=20){
            message = "do you want another card?"
        }
        else if(sumUser==21 && cardsUser.length==2){
            hasBlackjack = true
            isAlive = false
            message = "Blackjack!"
            player.chips+=50
        }
        else if(sumUser>21){
            if(cardsUser.every( ucard => ucard.value<11)){
                message = "you lost"
                isAlive = false
                player.chips-=50
            }
            else{
                let ace=cardsUser.findIndex(ucard => ucard.value>10 )
                cardsUser[ace].value=1
                renderGame()
            }
            
        }
        else{
            playBtns.style.display='none'
            setTimeout(function(){
                dealerRenderGame()
            },500)
            
        }
        messageEl.textContent = message 
        sumEl.textContent = "player: "+sumUser
        dealerSum.textContent="dealer: " +sumDealer
        playerEl.textContent = player.name + " : $" +player.chips
        if(isAlive&&!hasBlackjack){
            playBtns.style.display='flex'
            startGameBtn.style.display='none'
        }
        else{
        startGameBtn.style.display='block'
            playBtns.style.display='none' 
        }
        
    }

    function newCard(){
        if(isAlive&&!hasBlackjack){
            let newCard = getRandomCard()
            cardsUser.push(newCard)
            renderGame()
        }
    }
            function dealerRenderGame() {
                isAlive = false;
                playBtns.style.display = 'none';
                setTimeout(function(){
                    dealerCardImg.innerHTML = `<img class="card-img" src="cards${theme}/${cardsDealer[0].img}">
                    <img class="card-img" src="cards${theme}/${cardsDealer[1].img}">
                `;
                sumDealer = cardsDealer[0].value + cardsDealer[1].value;
                dealerSum.textContent = "dealer: " + sumDealer;
                dealerDraw(handleResult);
                },1000)
            }
            
                function dealerDraw() {
                    sumDealer = 0
                    for(let acard of cardsDealer){
                        sumDealer+=acard.value
                    }
                    dealerSum.textContent = "dealer: "+sumDealer
                    if (sumDealer < 17) {
                        setTimeout(function () {
                            cardsDealer.push(getRandomCard())
                            dealerCardImg.innerHTML += `<img class="card-img" src="cards${theme}/${cardsDealer[cardsDealer.length - 1].img}">`
                            sumDealer += cardsDealer[cardsDealer.length - 1].value
                            dealerSum.textContent = "dealer: " + sumDealer
                            dealerDraw()
                        }, 1500)
                    } else {
                        handleResult()
                    }
                }
            
                function handleResult() {
                    if (sumDealer > 21) {
                        if(cardsDealer.every( dcard => dcard.value<11)){
                            messageEl.textContent = "You won!!!";
                            player.chips+=50
                        }
                        else{
                        let Dace=cardsDealer.findIndex(dcard => dcard.value>10 )
                            cardsDealer[Dace].value=1
                            dealerDraw()
                        }
                        
                    } else {
                        if (sumDealer > sumUser) {
                            messageEl.textContent = "You lost"
                            player.chips -=50
                        } else if (sumDealer === sumUser) {
                            messageEl.textContent = "Tie";
                        } else {
                            messageEl.textContent = "You won"
                            player.chips+=50
                        }
                    }
                    startGameBtn.style.display = 'block';
                    playerEl.textContent = player.name + " : $" +player.chips
                }
})
   
    


        
          