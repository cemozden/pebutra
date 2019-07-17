import * as assert from "assert";
import { generateID } from "../util/IDUtil";
import "mocha";

describe('#IDUtil.generateID(length)', () => {
    it('should provide a random id with given length', () => {
        const generatedId = generateID(10);

        assert.equal(generatedId.length, 10);
    });
});