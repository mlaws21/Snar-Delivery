module backend::request {

    // Imports: TODO
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;
    use sui::table::{Self, Table};
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;


    const EBadFulfill: u64 = 0;
    const EInsufficientBalance: u64 = 0;


    struct Request has key, store {
        id: UID,
        name: String,
        building: String, 
        room: String,
        swipe: bool,
        food: String,
        // price: Balance<SUI>,
        price: u64,
        fulfilled: bool,
    }

    struct PendingRequests has key {
        id: UID,
        num_reqs: u64,
        request_created: Table<u64, Request>,
    }

    public fun display_requests(
        ctx: &mut TxContext
    ) {
        let reqs = table::new<u64, Request>(ctx);

        transfer::share_object(
            PendingRequests {
                id: object::new(ctx),
                num_reqs: 0,
                request_created: reqs, // The pixels is set to the vector of vectors created above
            }
        );
    }

    public fun add_request(
        self: &mut PendingRequests,
        req: Request,
    ) {
        table::add(&mut self.request_created, self.num_reqs, req);
        self.num_reqs = self.num_reqs + 1;
    }

    public fun fulfill_request(
        self: &mut PendingRequests,
        payment_wallet: &mut Coin<SUI>,
        fulfiller_wallet: Balance<SUI>,
        fulfilled: u64,
        
    ) {
        assert!(fulfilled < self.num_reqs, EBadFulfill);

        self.num_reqs = self.num_reqs - 1;
        let removed_request = table::remove(&mut self.request_created, fulfilled);
        let Request { id,
        name: _,
        building: _, 
        room: _,
        swipe: _,
        food: _,
        price: to_pay,
        fulfilled: _} = removed_request;


        assert!(coin::value(payment_wallet) >= to_pay, EInsufficientBalance);


        let coin_balance = coin::balance_mut(payment_wallet);
        let paid = balance::split(coin_balance, to_pay);
        
        balance::join(&mut fulfiller_wallet, paid);

        object::delete(id);






    }



}