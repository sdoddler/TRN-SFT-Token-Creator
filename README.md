# TRN-SFT-Token-Creator
Utility NodeJS script to batch Create names of SFTokens on The Root Network

This is useful if you have a large number of SFTokens you wish to name - I have left the example of The Shillverse Items in SFT_TOKENS_INFO variable as an example.

I have used a key/pair array for ease of use to track which Number = Which Name, it could be done with a simple array of Strings.

## Usage
This script presumes you have already created a collection on Porcini/Root and know the collection ID
- Replace 57444 in `const SFT_COLLECTION_ID = 57444;` with your collection ID
- Input your hex based private key for the account you are minting from: `const SFT_CREATOR_KEY = "";`
- Format your array and replace content of `const SFT_TOKENS_INFO` variable
- Switch `...getPublicProvider("root"),` to "porcini" if using the testnet

This scripts executes the creation of these tokens as a batch, and writes when it has been included in the block, waiting 40 seconds before exiting.

I have included hte non-batch method commented out to show process & a little more information for debugging.
