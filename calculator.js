//declare variables
var multiplier = 0
,   unit = ""
,   numberAsText = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"]
,	boxes = ["assumptions", "about", "contact", "disclaimer", "donate"];

//Assumptions
                   //weight in mg/mcg, mcg of T3, mcg of T4, unit1,     unit2
var armour         = [      60,             9,        38,     "mg",  "60 mg grain"      ]
,   thiroyd        = [      60,             8,        35,     "mg",  "grain"            ]
,   natureThroid   = [      65,             9,        38,     "mg",  "65 mg grain"      ]
,   naturalSources = [     300,             8,        32,     "mg",  "capsule"          ]
,   t3             = [      25,            25,         0,    "mcg",  "25 mcg grain"     ]
,   t4             = [      50,             0,        50,    "mcg",  "50 mcg grain"     ]
,   thyroGold      = [      50,          12.5,        50,     "mg",  "150 mg capsule"   ];
//No need to enter data for others because...
//Thyroid S and NP Thyroid =  Armour
//WP Thyroid = Nature-Throid
//Cytomel and Liothyronine = T3
//Synthroid and Eltroxin = T4
//etc.
//Further details are at the end of this page
   
function ShowOrHideBox(clickedBox){
	string = "#" + clickedBox;
	$(string).slideToggle("slow"); //show the box that the user selected
		
	for (var i = 5; i--; ) {
		//if the user didn't select a particular option, then close that box, if it's open
		if (boxes[i] != clickedBox) { 
			string = "#" + boxes[i]; 
			$(string).slideUp("slow");
		}	
	}
}

function ShowCalculation(){
	var inputDosage     = document.getElementById("InputDosage").value;
	var inputUnit       = document.getElementById("InputUnit").value;
	var inputMedication = document.getElementById("InputMedication").value;
	if (inputDosage != "" && inputUnit != "" && inputMedication != ""){ //if the user has entered values for all three variables
		
		inputMedicationData = Data(inputMedication);
		
		weight = inputMedicationData[0];
		
		//get ingredients, if available
		if (Ingredients(inputMedication) != undefined){
			ingredients = "<p>You might also like to know that the ingredients of " + inputMedication + " are: " + Ingredients(inputMedication) + ".</p>";
		}
		else {
			ingredients = "";
		}
		
		switch (inputUnit){
			case 'mg/mcg':
				inputUnit  = inputMedicationData[3];
				
				//Calculate t3 in the thing the user just entered
				t3InOneMgOrMcg = inputMedicationData[1] / inputMedicationData[0]; 
				inputT3 = t3InOneMgOrMcg * inputDosage;	//inputT3 = t3 in one mg/mcg x dosage in mg/mcg

				//Calculate t4 in the thing the user just entered				
				t4InOneMgOrMcg = inputMedicationData[2] / inputMedicationData[0];
				inputT4 = t4InOneMgOrMcg * inputDosage;	//inputT4 = t4 in one mg/mcg x dosage in mg/mcg	
				
				//Calculate the T4 equivalent of the input medication
				t4Equivalent = inputT4 + (inputT3 * 4);
				
				break;      
			case 'grains':
				inputUnit  = inputMedicationData[4];

				//Calculate T3 in the thing the user just entered				
				t3InOneGrain = inputMedicationData[1];
				inputT3 = t3InOneGrain * inputDosage; //inputT3 = t3 in one grain x dosage in grains
				
				//Calculate T4 in the thing the user just entered
				t4InOneGrain = inputMedicationData[2];
				inputT4 = t4InOneGrain * inputDosage; //inputT4 = t4 in one grain x dosage in grains

				//Calculate the T4 equivalent of the input medication				
				t4Equivalent = inputT4 + (inputT3 * 4);
				
				break;
			}

		//Output
		document.getElementById("output").innerHTML = 
			"<p style=\"margin-bottom:-32px;\"> <b>The equivalent of " + CheckIfNumberCanBeWrittenAsText(inputUnit, inputDosage) + " " + CheckIfUnitShouldBePlural(inputDosage,inputUnit) + " of " + inputMedication + " is:</b></p><ul><li>" +  
			Math.round(t4Equivalent / 4) + " mcg of triiodothyronine (T3)</li><br><li>or " + 
			Math.round(t4Equivalent) + " mcg of levothyroxine (T4)</li><br><li>or " + 
			Math.round(t4Equivalent / (74/60)) + " mg of Armour, Thyroid-S, or NP Thyroid (i.e. " + RemoveTrailingZeroes((t4Equivalent / (74/60))/60) + " grains)</li><br><li>or " + 
			Math.round(t4Equivalent / (74/65)) + " mg of Nature-Throid or WP Thyroid (i.e. " + RemoveTrailingZeroes((t4Equivalent / (75/65))/65) + " grains)</li><br><li>or " + 
			Math.round(t4Equivalent /  (2/3)) + " mg of Thyro-Gold</li><br><li>or " + 
			Math.round(t4Equivalent / (67/60)) + " mg of Thiroyd (i.e. " + RemoveTrailingZeroes((t4Equivalent / (67/60))/60) + " grains)</li><br><li>or " + 
			Math.round(t4Equivalent / (64/300)) + " mg of Natural Sources Raw Thyroid (i.e. " + RemoveTrailingZeroes((t4Equivalent / (64/300))/300) + " capsules)</li></ul>" +
			"<p style=\"margin-top:32px;\"> By the way, " + CheckIfNumberCanBeWrittenAsText(inputUnit, inputDosage) + " " + CheckIfUnitShouldBePlural(inputDosage,inputUnit) + " of " + inputMedication + " contains " + RemoveTrailingZeroes(inputT3) + " mcg of T3 and " + RemoveTrailingZeroes (inputT4) + " mcg of T4.</p>" + ingredients
			;
		$('#output').slideDown("slow"); //makes tbe answer slide instead of appearing immediately
	}
}

function CheckIfUnitShouldBePlural(inputDosage, inputUnit){
	if (inputDosage == 1 || inputDosage == "mg" || inputDosage == "mcg"){ 
		return inputUnit;
	}
	else { 
		pluralisedInputUnit = inputUnit + "s"; return pluralisedInputUnit;
	}
}

function CheckIfNumberCanBeWrittenAsText(inputUnit, startVal){
	if (startVal == parseInt(startVal,10) && startVal >= 0 && startVal <= 12 && inputUnit !="mg" && inputUnit !="mcg") {
		return numberAsText[startVal]; 
	}
	else {
		return startVal;
	}
}

//If there is a zero after a decimal point, then just present that number to zero decimal places
function RemoveTrailingZeroes(startVal) {
  if (startVal.toFixed(1) == (Math.floor(startVal)).toFixed(1)){ //basically if the value is an integer
      return startVal.toFixed(0);
  }
  else{
      return startVal.toFixed(1);
   }
}

function Data(medicationName){
	switch (medicationName){
		case 'Armour Thyroid':              
		case 'NP Thyroid':          
		case 'Thyroid-S':  
			return armour; break;
		case 'WP Thyroid':
		case 'Nature-Throid':               
			return natureThroid; break;
		case 'Natural Sources Raw Thyroid': 
			return naturalSources; break;
		case 'T3':
		case 'Triiodothyronine':
		case 'Liothyronine sodium':
			return t3; break;
		case 'T4':                          
		case 'Synthroid':
		case 'Eutirox':
		case 'Eltroxin':
		case 'Levothyroxine':
		case 'Euthyrox':
		case 'Letrox':
		case 'Levaxin':
		case 'Lévothyrox':
		case 'L-thyroxine':
		case 'Thyrax':
		case 'Thyrax Duotab':
		case 'Thyrox':
		case 'Thyronorm':
		case 'Unithroid':
		case 'Levoxyl':
		case 'Tirosint':
		case 'Thyrin':
		case 'Thyrolar':
			return t4; break;
		case 'Thiroyd':           
		case 'ERFA':
			return thiroyd; break;
		case 'Thyro-Gold':                  
			return thyroGold; break;
   }
}

function Ingredients(medicationName){
	switch (medicationName){
		//from https://stopthethyroidmadness.com/armour-vs-other-brands/
		case 'ERFA': 
			return "Dried Thyroid, Magnesium Stearate, Cornstarch, Talc and Sugar"; break;
		case 'Nature-Throid': 
			return "Colloidal silicon dioxide, Dicalcium Phosphate, Lactose Monohydrate, Magnesium Stearate, Microcrystalline Cellulose, Croscarmellose Sodium, Stearic Acid, Opadry II 85F19316 Clear, and Porcine Thyroid Powder"; break;
		case 'NP Thiroyd': 
			return "Calcium Stearate, Dextrose Monohydrate, Maltodextrin, and Mineral oil"; break;	
	}
}