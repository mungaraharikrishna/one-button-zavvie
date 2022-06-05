import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FieldNameService {

  constructor() { }

  ////////////////////////
  // Question Field Names
  ////////////////////////
  FieldNames = {
    confirmAddress: {
      Address: 'Address',
      UnitNumber: 'UnitNumber'
    },
    sellerSolutions: {
      SellerSolutions: 'SellerSolutions',
      HomeToBuy: 'HomeToBuy'
    },
    buyerSolutions: {
      BuyerSolutions: 'BuyerSolutions',
      HomeToSell: 'HomeToSell'
    },
    generalInfo: {
      AgentFirstName: 'AgentFirstName',
      AgentLastName: 'AgentLastName',
      AgentEmail: 'AgentEmail',
      AgentPhone: 'AgentPhone',
      AgentID: "AgentID",
      AgentClientFirstName: 'AgentClientFirstName',
      AgentClientLastName: 'AgentClientLastName',
      AgentClientEmail: 'AgentClientEmail',
      ClientPhone: 'ClientPhone',
      SignedListingAgreement: 'SignedListingAgreement'
    },
    buyerInfo: {
      MaxRange: 'MaxRange',
      BuyerLocation: 'BuyerLocation',
      Prequalified: 'Prequalified',
      LoanFirstName: 'LoanFirstName',
      LoanLastName: 'LoanLastName',
      LoanEmail: 'LoanEmail',
      LoanPhone: 'LoanPhone',
      LoanType: 'LoanType',
      HomeToSell: 'HomeToSell'
    },
    property1: {
      ApproximateHomeVal: 'ApproximateHomeVal',
      HomeCondition: 'HomeCondition',
      PropertyType: 'PropertyType',
      HomeType: 'HomeType',
      InvPropRented: 'InvPropRented',
      LeaseEnd: 'LeaseEnd'
    },
    property2: {
      Number_Bedrooms: 'Number_Bedrooms',
      Number_FullBathrooms: 'Number_FullBathrooms',
      Number_3QtrBathrooms: 'Number_3QtrBathrooms',
      Number_HalfBathrooms: 'Number_HalfBathrooms',
      Number_QtrBathrooms: 'Number_QtrBathrooms'
    },
    property3: {
      TotalSqFt: 'TotalSqFt',
      AboveGroundSqFt: 'AboveGroundSqFt',
      BelowGroundSqFt: 'BelowGroundSqFt',
      YearBuilt: 'YearBuilt',
      YearPurchased: 'YearPurchased',
      Number_Floors: 'Number_Floors',
      Number_GarageSpaces: 'Number_GarageSpaces',
      GarageType: 'GarageType'
    },
    property4: {
      Additions: 'Additions',
      AdditionsType: 'AdditionsType',
      AdditionsLocations: 'AdditionsLocations',
      MasterBedroomLocation: 'MasterBedroomLocation',
      BasementType: 'BasementType'
    },

    interior1: {
      Interior_Paint: 'Interior_Paint',
      Neutral_Interior_Paint_Colors: 'Neutral_Interior_Paint_Colors'
    },
    interior2: {
      Kitchen_Counter_Tops: 'Kitchen_Counter_Tops',
      Kitchen_Appliances: 'Kitchen_Appliances'
    },
    interior3: {
      Kitchen_Special_Features: 'Kitchen_Special_Features',
      Remodeled_Kitchen: 'Remodeled_Kitchen',
      Overall_Condition_of_Kitchen: 'Overall_Condition_of_Kitchen'
    },
    interior4: {
      Bathroom_Special_Features: 'Bathroom_Special_Features',
      Remodeled_Master_Bathroom: 'Remodeled_Master_Bathroom',
      Overall_Condition_of_Master_Bathroom: 'Overall_Condition_of_Master_Bathroom'
    },
    interior5: {
      Kitchen_Flooring_Types: 'Kitchen_Flooring_Types',
      Kitchen_Flooring_Condition: 'Kitchen_Flooring_Condition',
      Main_Flooring_Types: 'Main_Flooring_Types',
      Main_Flooring_Condition: 'Main_Flooring_Condition'
    },
    interior6: {
      Bedroom_Flooring_Types: 'Bedroom_Flooring_Types',
      Bedroom_Flooring_Condition: 'Bedroom_Flooring_Condition',
      Bathroom_Flooring_Types: 'Bathroom_Flooring_Types',
      Bathroom_Flooring_Condition: 'Bathroom_Flooring_Condition'
    },
    interior7: {
      Appliances_that_need_to_be_replaced: 'Appliances_that_need_to_be_replaced',
      Known_Issues_with_the_Following: 'Known_Issues_with_the_Following',
      Needs_Major_Repairs: 'Needs_Major_Repairs',
      Needs_Major_Updating: 'Needs_Major_Updating'
    },
    exterior1: {
      Home_Features: 'Home_Features',
      Shared_Well: 'Shared_Well',
      Solar_Panels: 'Solar_Panels',
      Solar_Own_Lease: 'Solar_Own_Lease',
      Solar_Company: 'Solar_Company',
      Swimming_Pool: 'Swimming_Pool',
      Pool_Type: 'Pool_Type',
      Spa: 'Spa'
    },
    exterior2: {
      Front_Yard_Landscaping: 'Front_Yard_Landscaping',
      Back_Yard_Landscaping: 'Back_Yard_Landscaping'
    },
    exterior3: {
      Exterior_Paint: 'Exterior_Paint',
      Backyard_Fence: 'Backyard_Fence',
      Roof_Condition: 'Roof_Condition',
      Property_Backs_up_to: 'Property_Backs_up_to'
    },
    homeownerinfo1: {
      ApproximateHomeVal: 'ApproximateHomeVal',
      Repair_Cost: 'Repair_Cost',
      WhenReadyToSell: 'WhenReadyToSell',
      Message: 'Message'
    },

    homeownerinfo2: {
      Mortgage_Balance: 'Mortgage_Balance',
      Use_Equity: 'Use_Equity',
      Money_Needed: 'Money_Needed',
      Additional_Debt: 'Additional_Debt',
      Monthly_HOA_Fees: 'Monthly_HOA_Fees'
    },
    homeownerinfo3: {
      Buying_Replacement_Home: 'Buying_Replacement_Home',
      Buying_In_City: 'Buying_In_City',
      BuyingPriceRangeLow: 'BuyingPriceRangeLow',
      BuyingPriceRangeHigh: 'BuyingPriceRangeHigh',
      Ready_To_Make_Offer: 'Ready_To_Make_Offer',
      Prequalify_Me: 'Prequalify_Me',
      Monthly_Income: 'Monthly_Income',
      Additional_Income: 'Additional_Income'
    },

    clientContactInfo: {
      ClientFirstName: 'ClientFirstName',
      ClientLastName: 'ClientLastName',
      ClientEmail: 'ClientEmail',
      ClientPhone: 'ClientPhone',
      LoanOfficerFirstName: 'LoanOfficerFirstName',
      LoanOfficerLastName: 'LoanOfficerLastName',
      LoanOfficerEmail: 'LoanOfficerEmail',
      LoanOfficerPhone: 'LoanOfficerPhone',
      LoanOfficerID: 'LoanOfficerID',
      AdditionalclientFirstName: 'AdditionalclientFirstName',
      AdditionalclientLastName: 'AdditionalclientLastName',
      AdditionalclientEmail: 'AdditionalclientEmail',
      AdditionalclientPhone: 'AdditionalclientPhone',
    },

  }
  getFieldName() {
    this.FieldNames;
  }
}