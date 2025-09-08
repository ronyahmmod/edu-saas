import Division from "../models/address/division.model.js";
import District from "../models/address/district.model.js";
import PostOffice from "../models/address/postoffice.model.js";
import Pouroshova from "../models/address/pouroshova.model.js";
import Union from "../models/address/union.model.js";
import Upazila from "../models/address/union.model.js";
import { restFactory } from "../utils/restFactory.js";

const divisionFactory = restFactory(Division);
const districtFactory = restFactory(District);
const postofficeFactory = restFactory(PostOffice);
const pouroshovaFactory = restFactory(Pouroshova);
const unionFactory = restFactory(Union);
const upazilaFactory = restFactory(Upazila);

export default {
  divisionFact: divisionFactory,
  districtFact: districtFactory,
  postFact: postofficeFactory,
  pouroFact: pouroshovaFactory,
  unionFact: unionFactory,
  upazilaFact: upazilaFactory,
};
