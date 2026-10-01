# Bridge Friction Index

A small, public UX research project for comparing what it takes to move USDC across chains.

The question is deliberately simple: **how much work does a user have to do before their USDC arrives?**

The live page compares representative flows for Across, Stargate, and Jumper. It surfaces the parts normal price comparisons hide: clicks, signatures, approvals, wallet/network changes, fees, and time to funds-available.

## What is measured

For each route, record:

- `clicks` — user-initiated UI actions from a fresh browser state
- `wallet prompts` — wallet confirmations, including approval and bridge transaction
- `approvals` — ERC-20 approvals requested by the selected path
- `network switches` — manual wallet chain changes required
- `fees` — quoted total cost in USD at observation time
- `latency` — observed time from submit confirmation to destination funds available

The site intentionally starts with **illustrative observations**, not live quotes. Bridge fees, supported routes, and approval behavior vary by token, chain, wallet, balance, and route. Replace the sample data through the in-page editor or by updating `dist/app.js` after a reproducible run.

## Reproducible test protocol

1. Use a fresh browser profile, the same wallet, and a fixed source/destination pair.
2. Start timing at the first route-selection click; stop when the destination balance is spendable.
3. Count every explicit click and wallet confirmation. Count a network switch only when the user has to act on it.
4. Capture the quoted fee immediately before submitting; repeat at least three runs on different days.
5. Record route availability and the exact timestamp. Never imply a single run is a universal result.

## Local use

Open `dist/index.html` in a browser. No build step or dependencies are required.

## Source inspiration

This project responds to the [r/defi discussion, “Why does moving crypto have to be a part time job?”](https://www.reddit.com/r/defi/comments/1wt6fpf/why_does_moving_crypto_have_to_be_a_part_time_job/).

## Safety note

This is UX research, not financial advice or an endorsement of any bridge. Always verify the destination chain, token contract, route, and current fees before signing.
