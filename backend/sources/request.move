module backend::request {

    // Imports:
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;
    use sui::table::{Self, Table};
    use sui::balance::Balance;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;


    const EBadFulfill: u64 = 0;

    struct Request has key, store {
        id: UID,
        key: u64,
        name: String,
        building: String, 
        room: String,
        swipe: String,
        food: String,
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
                request_created: reqs,
            }
        );
    }

    public fun add_request(
        self: &mut RequestBoard,
        my_name: String,
        my_building: String, 
        my_room: String,
        my_swipe: String,
        my_food: String,
        my_coin: Coin<SUI>,
        my_price: String,
        ctx: &mut TxContext,
        

    ) {
        let req = Request {
            id: object::new(ctx),
            key: self.num_reqs,
            name: my_name,
            building: my_building, 
            room: my_room,
            swipe: my_swipe,
            food: my_food,
            payment: coin::into_balance(my_coin),
            price: my_price,
        };
        
        table::add(&mut self.request_created, self.num_reqs, req);
        self.num_reqs = self.num_reqs + 1;
    }

    public fun fulfill_request(
        self: &mut RequestBoard,
        order_to_fulfil: u64,
        ctx: &mut TxContext,
        
    ) : Coin<SUI> {
        assert!(order_to_fulfil < self.num_reqs, EBadFulfill);

        let removed_request = table::remove(&mut self.request_created, order_to_fulfil);
        let Request { id,
        key: _,
        name: _,
        building: _, 
        room: _,
        swipe: _,
        food: _,
        payment: paid,
        price: _, 
        } = removed_request;

        let payment_coin = coin::from_balance(paid, ctx);

        object::delete(id);

        payment_coin
    }



}