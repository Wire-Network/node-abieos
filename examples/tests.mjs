import {Abieos} from "../lib/abieos.js";

export function typeTests() {

    const abieos = Abieos.getInstance();

    const typeTests = [
        {type: 'action', code: 'eosio', name: 'voteproducer', expects: 'voteproducer'},
        {type: 'action', code: 'eosio.token', name: 'transfer', expects: 'transfer'},
        {type: 'table', code: 'eosio', name: 'producers', expects: 'producer_info'},
        {type: 'table', code: 'eosio.token', name: 'stat', expects: 'currency_stats'},
        {type: 'table', code: 'eosio.msig', name: 'approvals2', expects: 'approvals_info'},
        {type: 'table', code: 'eosio.msig', name: 'proposal', expects: 'proposal'},
        {type: 'table', code: '2', name: 'null', expects: ''},
    ];

    typeTests.forEach((value, index) => {
        console.log(`[${index + 1}/${typeTests.length}] Testing ${value.type} type for ${value.code}::${value.name}`);
        try {
            const type = value.type === 'action' ?
                abieos.getTypeForAction(value.code, value.name) :
                abieos.getTypeForTable(value.code, value.name);
            if (type === value.expects) {
                console.log(`OK - ${type} === ${value.expects}`);
            } else {
                console.log(`ERROR - Got: ${type}, Expected: ${value.expects}`);
            }
        } catch (e) {
            console.log(`ERROR - ${e.message}`);
        }
    });
}

/**
 * Long-name regression test for abieos#12 / node-abieos#8.
 *
 * Pre-fix: `abieos_get_type_for_table` took a uint64 sysio::name, so any table
 * name longer than 12 chars (or with chars outside the sysio name alphabet)
 * was silently truncated during the `abieos_string_to_name` round-trip and
 * its ABI entry became unreachable. Post-fix: the name is passed as a free-form
 * string. Verify a >12-char table name resolves correctly.
 *
 * None of the standard EOSIO ABIs ship a table longer than 12 chars, so we
 * load a minimal custom ABI inline. The ABI is written in wire-sysio#288
 * format (includes `table_id` and `secondary_indexes`) since abieos#12 accepts
 * the new `abi_def` layout.
 */
export function longNameRegressionTest() {
    const abieos = Abieos.getInstance();

    const longNameAbi = {
        version: 'eosio::abi/1.2',
        types: [],
        structs: [
            {
                name: 'long_row',
                base: '',
                fields: [
                    {name: 'id', type: 'uint64'},
                    {name: 'payload', type: 'string'},
                ],
            },
        ],
        actions: [],
        tables: [
            {
                name: 'verylongtablename123',   // 20 chars; would have truncated pre-fix
                type: 'long_row',
                index_type: 'i64',
                key_names: ['id'],
                key_types: ['uint64'],
                table_id: 0,
                secondary_indexes: [],
            },
        ],
        ricardian_clauses: [],
        error_messages: [],
        abi_extensions: [],
        variants: [],
    };

    const loaded = abieos.loadAbi('longnamecontract', JSON.stringify(longNameAbi));
    if (!loaded) {
        console.log('ERROR - longNameRegressionTest: failed to load test ABI');
        return;
    }

    try {
        const type = abieos.getTypeForTable('longnamecontract', 'verylongtablename123');
        if (type === 'long_row') {
            console.log('OK - long table name (20 chars) resolved to long_row');
        } else {
            console.log(`ERROR - long table name lookup: got "${type}", expected "long_row"`);
        }
    } catch (e) {
        console.log(`ERROR - longNameRegressionTest exception: ${e.message}`);
    } finally {
        abieos.deleteContract('longnamecontract');
    }
}
