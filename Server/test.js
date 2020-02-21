

let counter = 0;

const mes = {

    heart : "\u2665",
    aaliyah : "Aaliyah",
    pogoShipda : 'pogo shipda',
    Saranghae : 'Saranghae',
    u_my_mvp : "be the best , My MVP odette",
    guin : "guinever",
    odet : "odette",
    angela : "angela",
    lunox : "lunox",
    kagura : "Kagura",
    i : "I",
    you : "you"
 
}

setInterval(() => {

    const log = (mes) => {
        console.log(mes);
    }

    if(counter === 0){
        log(`Hello, ${mes.aaliyah}`)
    }else if(counter === 1){
        log(mes.i)
    }else if(counter === 2){
        log(mes.heart)
    }else if(counter === 3){
        log(mes.you)
    }else if (counter === 4){
        log('so')
    }else if (counter ===5){
        log('much')
    }else if(counter === 6){
        log(`${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart}`)
    }else if(counter === 7){
        log(`Let's dance the night away my little nayeon`)
    }else if (counter === 8){
        log('My')
    }else if (counter === 9){
        log('Wanwan')
    }else if (counter === 10){
        log('Angela')
    }else if (counter === 11){
        log('guininever')
    }else if (counter === 12){
        log('Lunox')
    }else if (counter === 13){
        log('Kagura')
    }else if (counter === 14){
        log('Odette ' + mes.heart)
    }else if (counter === 15){
        log(mes.u_my_mvp);
    }else if(counter === 16){
        log(mes.pogoShipda)
    }else if (counter === 17){
        log(mes.Saranghae)
    }else if(counter=== 18){
        log(mes.aaliyah + ' Faith')
    }else if (counter === 19){
        log(`${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart}   `+ mes.Saranghae + `   ${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart} ${mes.heart}`)
    }

    if(counter === 19){counter = 0}


    counter ++

},1000)