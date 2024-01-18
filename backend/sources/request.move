module backend::request {

    // Imports: TODO
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;
    use sui::table::{Self, Table};
    use sui::balance::Balance;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;


    const EBadFulfill: u64 = 0;
    // const EInsufficientBalance: u64 = 0;


    struct Request has key, store {
        id: UID,
        name: String,
        building: String, 
        room: String,
        swipe: String,
        food: String,
        // price: Balance<SUI>,
        // payment: Coin<SUI>,
        payment: Balance<SUI>,
        price: String,
    }

    struct RequestBoard has key {
        id: UID,
        num_reqs: u64,
        request_created: Table<u64, Request>,
    }

    public fun display_requests(
        ctx: &mut TxContext,
    ) {
        let reqs = table::new<u64, Request>(ctx);

        transfer::share_object(
            RequestBoard {
                id: object::new(ctx),
                num_reqs: 0,
                request_created: reqs, // The pixels is set to the vector of vectors created above
            }
        );
    }

    // public fun get_request_data(
    //     the_request: &Request,
    // ) : vector<String> {
    //     let requestRep = vector::empty<String>();
    //     vector::push_back(&mut requestRep, the_request.name);
    //     vector::push_back(&mut requestRep, the_request.building);
    //     vector::push_back(&mut requestRep, the_request.room);
    //     vector::push_back(&mut requestRep, the_request.swipe);
    //     vector::push_back(&mut requestRep, the_request.food);
    //     vector::push_back(&mut requestRep,)

    //     requestRep
    // }

    // public fun get_table(
    //     board: &RequestBoard,
    // ) : &Table<u64, Request> {
    //     &board.request_created
    // }

    // public fun get_board(
    //     board: &RequestBoard,
    // ) //: vector<vector<String>>
    // {
    //     let loops = board.num_reqs;//table::length(&mut board.request_created);
    //     let i = 0;
    //     let boardRep = vector::empty<vector<String>>();
    //     while (i < loops) {
    //         if (table::contains(&board.request_created, i)) {

    //             let requestRep = vector::empty<String>();
    //             let thisRequest = table::borrow(&board.request_created, i);
    //             vector::push_back(&mut requestRep, i);
    //             vector::push_back(&mut requestRep, thisRequest.name);
    //             vector::push_back(&mut requestRep, thisRequest.building);
    //             vector::push_back(&mut requestRep, thisRequest.room);
    //             vector::push_back(&mut requestRep, thisRequest.swipe);
    //             vector::push_back(&mut requestRep, thisRequest.food);

    //             vector::push_back(&mut boardRep, requestRep);
    //         }
    //     }
        
    //     boardRep
    // }

    public fun add_request(
        self: &mut RequestBoard,
        // payment: &mut Coin<SUI>,
        // req: Request,
        my_name: String,
        my_building: String, 
        my_room: String,
        my_swipe: String,
        my_food: String,
        // price: Balance<SUI>,
        // payment: Coin<SUI>,
        my_coin: Coin<SUI>,
        my_price: String,

        // price: u64,
        ctx: &mut TxContext,
        

    ) {
        let req = Request { 
            id: object::new(ctx),
            name: my_name,
            building: my_building, 
            room: my_room,
            swipe: my_swipe,
            food: my_food,
            payment: coin::into_balance(my_coin),
            price: my_price,
        };
        
        // let paid = balance::split(req., shop.price);
        table::add(&mut self.request_created, self.num_reqs, req);
        self.num_reqs = self.num_reqs + 1;
    }

    public fun fulfill_request(
        self: &mut RequestBoard,
        // payment_wallet: &mut Coin<SUI>,
        // fulfiller_wallet: address,
        order_to_fulfil: u64,
        ctx: &mut TxContext,
        
    ) : Coin<SUI> {
        assert!(order_to_fulfil < self.num_reqs, EBadFulfill);

        self.num_reqs = self.num_reqs - 1;
        let removed_request = table::remove(&mut self.request_created, order_to_fulfil);
        let Request { id,
        name: _,
        building: _, 
        room: _,
        swipe: _,
        food: _,
        payment: paid,
        price: _, 
        } = removed_request;

        // assert!(coin::value(&mut payment_wallet) >= to_pay, EInsufficientBalance);

        // let coin_balance = coin::balance_mut(&mut payment_wallet);
        // let profit = coin::take(&mut payment_wallet, to_pay, ctx);
        // let paid = balance::split(coin_balance, to_pay);

        // let temp_balance = balance::zero<SUI>();
        let payment_coin = coin::from_balance(paid, ctx);
        // balance::join(&mut temp_balance, paid);

        // let all = balance::value(&temp_balance);
        // let profit = coin::take(&mut temp_balance, all, ctx);


        // transfer::public_transfer(profit, tx_context::sender(ctx));

        // balance::destroy_zero(temp_balance);
        // balance::join(&mut fulfiller_wallet, paid);


        object::delete(id);

        payment_coin
    }



}