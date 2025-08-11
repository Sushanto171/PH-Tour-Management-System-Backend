"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Division = void 0;
const mongoose_1 = require("mongoose");
const tour_model_1 = require("../tour/tour.model");
const divisionSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String },
    thumbnail: { type: String },
}, {
    versionKey: false,
    timestamps: true,
});
divisionSchema.pre("findOneAndDelete", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = Object.values(this.getQuery())[0];
            yield tour_model_1.Tour.deleteMany({ division: query });
            next();
        }
        catch (error) {
            throw new Error(error);
        }
    });
});
divisionSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (this.isModified("name")) {
                const baseSlug = this.name.toLowerCase().split(" ").join("-");
                let slug = `${baseSlug}-division`;
                let counter = 0;
                while (yield exports.Division.exists({ slug })) {
                    slug = `${baseSlug}-${counter++}-division`;
                }
                this.slug = slug;
            }
            next();
        }
        catch (error) {
            throw new Error(error);
        }
    });
});
divisionSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const division = this.getUpdate();
            if (division.name) {
                const baseSlug = division.name.toLowerCase().split(" ").join("-");
                let slug = `${baseSlug}-division`;
                let counter = 0;
                while (yield exports.Division.exists({ slug })) {
                    slug = `${baseSlug}-${counter++}-division`;
                }
                division.slug = slug;
                this.setUpdate(division);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
exports.Division = (0, mongoose_1.model)("Division", divisionSchema);
