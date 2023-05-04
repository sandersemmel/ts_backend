import LNBits from 'lnbits'; // using import
import * as randomstring from 'randomstring';

let lnbitsurl = "http://localhost:5000"

const { wallet, userManager, paywall, withdraw, paylink, tpos } = LNBits({
    // These are wallet details
    adminKey: 'SHOULD NOT BE EMPTY',
    invoiceReadKey: 'SHOULD NOT BE EMPTY',
    endpoint: 'hSHOULD NOT BE EMPTY', //default
  });



export async function getWalletDetailsTest(){
    let walletdetai = await wallet.walletDetails();
    //userManager.
    console.log("here are walletdetrails");
    console.log(walletdetai);
}

export async function createUser(user_wallet_name: string){
    let adminkey = randomstring.generate(32);
    let username = randomstring.generate(5)
    user_wallet_name = randomstring.generate(5);

    userManager.createUser({
        admin_id: adminkey,
        user_name: username,
        wallet_name: user_wallet_name
    })
}




export async function getAllWallets(){
    //userManager.
    await userManager.getUsers();
    //let users = await userManager.getUsers();
    //userManager.
    //console.log(users);
}