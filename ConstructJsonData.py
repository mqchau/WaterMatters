
def initializeWaterSupplyDemandTable():
	return []

def insertWaterSupplyDemandTable(table, onerow):
	table.append(onerow)	

def convertWaterSupplyDemandData(Lines):
	CurrentState = None
	CurrentCounty = None
	CurrentInfo = None
	WaterSupplyDemandTable = initializeWaterSupplyDemandTable()
	for lineidx in xrange(1,len(Lines)):
		ThisLine = Lines[lineidx].split(',')
		if len(ThisLine) < 20:
			break
		try:
			for idx in xrange(len(ThisLine)):
				if ThisLine[idx] == '':
					ThisLine[idx] = 0 
			newrow = {
				"StateAbbr": ThisLine[0],
				"County": ThisLine[1],
				"InfoByYear": [
					{
						"Year": 2010,
						"TotalPopulation" : float(ThisLine[3]) ,
						"DomesticUsageFreshWaterPerDay" : float(ThisLine[4]) ,
						"DomesticUsageFreshWaterPerYear" : round(float(ThisLine[5]) / 1e6, 2) ,
						"PublicSupplyPerDay": float(ThisLine[6]),
						"PublicSupplyPerYear": round(float(ThisLine[7]) / 1e6, 2),
						"IndustrialPerDay": float(ThisLine[8]),
						"IndustrialPerYear": round(float(ThisLine[9]) / 1e6, 2),
						"IrrigationPerDay": float(ThisLine[10]),
						"IrrigationPerYear": round(float(ThisLine[11]) / 1e6, 2),
						"IrrigationCropPerDay": float(ThisLine[12]),
						"IrrigationCropPerYear": round(float(ThisLine[13]) / 1e6, 2),
						"LivestockPerDay": float(ThisLine[14]),
						"LivestockPerYear": round(float(ThisLine[15]) / 1e6, 2),
						"AquaculturePerDay": float(ThisLine[16]),
						"AquaculturePerYear": round(float(ThisLine[17]) / 1e6, 2),
						"MiningPerDay": float(ThisLine[18]),
						"MiningPerYear": round(float(ThisLine[19]) / 1e6, 2),
						"ThermalElectricPerDay": float(ThisLine[20]),
						"ThermalElectricPerYear": round(float(ThisLine[21]) / 1e6, 2),
						"ThermalElectricOneThroughPerDay": float(ThisLine[22]),
						"ThermalElectricOneThroughPerYear": round(float(ThisLine[23]) / 1e6, 2),
						"ThermalElectricRecirculationPerDay": float(ThisLine[24]),
						"ThermalElectricRecirculationPerYear": round(float(ThisLine[25]) / 1e6, 2),
						"TotalFreshWaterPerDay": float(ThisLine[26]),
						"TotalFreshWaterPerYear": round(float(ThisLine[27]) / 1e6, 2),
						"TotalGroundWaterPerDay": float(ThisLine[28]),
						"TotalGroundWaterPerYear": round(float(ThisLine[29]) / 1e6, 2)
						}

					]
				}
			insertWaterSupplyDemandTable(WaterSupplyDemandTable,newrow)
		except Exception as e:
			import pprint
			pp = pprint.PrettyPrinter(indent=4)
			print "Can't process this line: %s " % pp.pformat(ThisLine)
			break
			pass

	return WaterSupplyDemandTable

if __name__ == "__main__":
	import argparse,json
	parser = argparse.ArgumentParser()
	parser.add_argument('--dataset', required=True, type=int, help='an integer for the selection of data set')

	args = parser.parse_args()
	print("You select to process dataset number %d" % args.dataset)
	if args.dataset == 1:
		filename = "Water consumption.csv"
	with open(filename, 'r') as f:
		AllLine = f.readlines()[0].split('\r')
	if args.dataset == 1:
		ProcessedData = convertWaterSupplyDemandData(AllLine)
		OutputFileName = "WaterSupplyDemandData.js"
		OutputVariableName = "WaterSupplyDemandData"

	with open(OutputFileName, "w") as f:
		f.write('''
			var %s = %s;

			module.exports = {
				%s : %s
			};
			''' %( OutputVariableName, json.dumps(ProcessedData, indent=4), OutputVariableName, OutputVariableName))


