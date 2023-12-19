const { Client } = require('../dist')

const Arklow = new Client({
    api_key: process.env.ARKLOW_API_KEY,
    team_id: process.env.ARKLOW_TEAM_ID
})

var USE_ENTITY = ""
var USE_ENTITLEMENT = process.env?.ARK_TEST_ENTITLEMENT ?? "3257449095443439616"
var USE_ENTITLEMENT_NAME = process.env?.ARK_TEST_ENTITLEMENT_NAME ?? "updated_product_feature"

test('Create Entity', async () => {
    const Request = await Arklow.Entity().Create('test_ref_1')
    expect(Request.success).toBeTruthy()
    expect(Request.data).toHaveProperty('entity.reference_id')
    expect(Request.data).toHaveProperty('entity.entity_id')
    expect(Request.data?.entity?.reference_id).toBe('test_ref_1')
    expect(Request.errors).toBeNull()
    USE_ENTITY = Request.data?.entity?.entity_id
})
test('Create Entity Entitlement', async () => {
    const Request = await Arklow.Entity(USE_ENTITY).Entitlement(USE_ENTITLEMENT).Create(USE_ENTITLEMENT_NAME)
    expect(Request.success).toBeTruthy()
    expect(Request.data).toBeNull()
    expect(Request.errors).toBeNull()
})
test('Check Entity Entitlement', async () => {
    const Request = await Arklow.Entity(USE_ENTITY).Entitlement(USE_ENTITLEMENT).Has(USE_ENTITLEMENT_NAME)
    
    expect(Request.success).toBeTruthy()
    expect(Request.data).toHaveProperty('entity_entitlement.valid')
    expect(Request.data?.entity_entitlement?.valid).toBeTruthy()
    expect(Request.errors).toBeNull()
})
test('Check Entity Entitlement After Removal', async () => {
    const Request = await Arklow.Entity(USE_ENTITY).Entitlement(USE_ENTITLEMENT).Remove(USE_ENTITLEMENT_NAME)
    
    expect(Request.success).toBeTruthy()
    expect(Request.data).toBeNull()
    expect(Request.errors).toBeNull()
    const Request2 = await Arklow.Entity(USE_ENTITY).Entitlement(USE_ENTITLEMENT).Has(USE_ENTITLEMENT_NAME)
    expect(Request2.success).toBeTruthy()
    expect(Request2.data).toHaveProperty('entity_entitlement.valid')
    expect(Request2.data?.entity_entitlement?.valid).toBeFalsy()
    expect(Request2.errors).toBeNull()
})
test('Cleanup Entity', async () => {
    const Request = await Arklow.Entity(USE_ENTITY).Delete()
    
    expect(Request.success).toBeTruthy()
    expect(Request.data).toBeNull()
    expect(Request.errors).toBeNull()
})
test('Check Entity Doesn\'t Exist any more.', async () => {
    const Request = await Arklow.Entity(USE_ENTITY).Get()
    expect(Request.success).toBeFalsy()
    expect(Request.errors).not.toBeNull()
    expect(Request?.errors?.length).toBeGreaterThan(0)
})

