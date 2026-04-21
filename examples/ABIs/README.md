# Example ABI fixtures

Test ABIs for `examples/basic.mjs`.

| File | Format | Contents | Used by |
|---|---|---|---|
| `eosio.json` | JSON (`eosio::abi/1.2`) | EOSIO system contract (voteproducer, producers, namebids, rex*, etc.) | action + table type lookups |
| `eosio.msig.json` | JSON (`eosio::abi/1.1`) | `eosio.msig` multisig contract (propose, approve, cancel, approvals2, proposal) | table type lookups |
| `eosio.token.json` | JSON (`eosio::abi/1.1`) | `eosio.token` contract (transfer, accounts, stat) — human-readable source | reference / comparison |
| `eosio.token.raw` | base64 binary ABI (`eosio::abi/1.1`) | Same contract as `eosio.token.json`, serialized as the on-chain binary `abi_def` and base64-wrapped | `loadAbiHex` path coverage in basic.mjs |

## Regenerating `eosio.token.raw`

The `.raw` file is a base64 wrapper around the binary `abi_def`. Decode:

```sh
base64 -d eosio.token.raw | xxd | head
# first 16 bytes: 0e 65 6f 73 69 6f 3a 3a 61 62 69 2f 31 2e 31 ...
#                 ^^ length                                  ^^ "eosio::abi/1.1"
```

To regenerate from `eosio.token.json`, use any tool that produces the on-chain binary `abi_def` (e.g. `abieos` CLI, a `wire-sysio` dev node via `get_raw_abi`) and base64-wrap the result:

```sh
# with abieos CLI (not included — build from submodule)
abieos --abi-to-bin eosio.token.json | base64 -w0 > eosio.token.raw
```

## Versions

- `eosio::abi/1.1`: pre-wire-sysio-#288 format; no `table_id` / `secondary_indexes` / `enums` / `protobuf_types`
- `eosio::abi/1.2`: wire-sysio-#288+ format; adds `table_id` (uint16 namespace slot), per-table `secondary_indexes`, top-level `enums` + `protobuf_types` extensions

abieos PR #12 parses both versions; the binary extensions are `may_not_exist`-tagged so older ABIs deserialize cleanly.
