/***********************************************************************
 * Author: Morgan Loring
 * Email: morganl@flowjo.com
 * Purpose: Tests the MST for correct data and that it can be rendered
 ***********************************************************************/
const expect = require('chai').expect;
const util = require('util')
import { makeGraph, makeMSTNodes, normalizeData } from '../../lib/MST/MSTHelper';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

enzyme.configure({ adapter: new Adapter.default() });

const testData = [
    ['CellID', 'col1', 'col2', 'col3'],
    [1, 3767, 1986, 879],
    [2, 4920, 6161, 721],
    [3, 4607, 6640, 520],
    [4, 3524, 660, 8204],
    [5, 4248, 6390, 304],
    [6, 3003, 851, 4529],
    [7, 1548, 875, 1798],
    [8, 42, 2996, 8610],
    [9, 245, 1818, 3846],
    [10, 2050, 960, 984],
    [11, 1357, 4727, 94],
    [12, 4858, 4729, 45],
    [13, 4523, 2009, 70],
    [14, 4699, 4577, 18],
    [15, 438, 3572, 813],
    [16, 2779, 5895, 29],
    [17, 1132, 5118, 78],
    [18, 3026, 4173, 90],
    [19, 275, 6863, 860],
    [20, 460, 290, 2414],
    [21, 3133, 6617, 76],
    [22, 4096, 6298, 96],
    [23, 4705, 147, 603],
    [24, 39, 6209, 7660],
    [25, 4126, 5484, 32],
    [26, 4661, 4302, 15],
    [27, 1732, 6108, 84],
    [28, 1462, 6357, 45],
    [29, 4331, 869, 241],
    [30, 68, 5216, 5924],
    [31, 4307, 834, 302],
    [32, 2627, 3307, 74],
    [33, 1907, 6749, 70],
    [34, 625, 2919, 613],
    [35, 2278, 3941, 93],
    [36, 4428, 248, 492],
    [37, 593, 3539, 804],
    [38, 948, 1114, 88],
    [39, 1113, 1718, 28],
    [40, 469, 1616, 320],
    [41, 2819, 6526, 30],
    [42, 587, 199, 8243],
    [43, 572, 384, 5032],
    [44, 2119, 706, 763],
    [45, 2168, 5993, 52],
    [46, 4237, 5960, 89],
    [47, 1080, 5577, 39],
    [48, 2722, 355, 993],
    [49, 1479, 1917, 47],
    [50, 3168, 5834, 71],
    [51, 4798, 1683, 30],
    [52, 2303, 2929, 92],
    [53, 4017, 5639, 59],
    [54, 859, 6170, 187],
    [55, 955, 242, 5360],
    [56, 1803, 6058, 66],
    [57, 2076, 1952, 57],
    [58, 686, 4937, 990],
    [59, 763, 6076, 291],
    [60, 1064, 2872, 41],
    [61, 4023, 5196, 52],
    [62, 4968, 3485, 27],
    [63, 3126, 4950, 30],
    [64, 3383, 3797, 72],
    [65, 987, 1545, 528],
    [66, 1791, 6045, 11],
    [67, 4959, 3239, 90],
    [68, 3934, 4079, 63],
    [69, 1247, 4759, 74],
    [70, 4659, 295, 420],
    [71, 3320, 4145, 23],
    [72, 1356, 1078, 84],
    [73, 695, 4613, 754],
    [74, 4771, 6936, 27],
    [75, 1826, 5304, 67],
    [76, 3121, 3123, 78],
    [77, 4272, 3790, 66],
    [78, 3581, 5577, 56],
    [79, 2278, 1525, 63],
    [80, 2853, 5621, 43],
    [81, 3619, 6574, 69],
    [82, 1863, 6843, 55],
    [83, 2004, 1532, 82],
    [84, 4668, 2506, 46],
    [85, 4536, 5695, 30],
    [86, 1030, 1851, 41],
    [87, 1914, 4082, 27],
    [88, 981, 1972, 291],
    [89, 471, 6379, 138],
    [90, 623, 3447, 401],
    [91, 281, 1391, 664],
    [92, 3869, 3055, 59],
    [93, 480, 549, 6602],
    [94, 2890, 743, 772],
    [95, 3734, 3423, 61],
    [96, 671, 3441, 615],
    [97, 4347, 1667, 61],
    [98, 509, 3574, 94],
    [99, 3134, 12, 2405],
    [100, 3247, 6931, 9698]
]

const selectedCols = [0, 1];

const mstData = [[1, 0, 4331.285490475086],
[2, 1, 572.1975183448457],
[3, 0, 1348.0819708014792],
[4, 2, 437.47114190538326],
[5, 3, 554.9071994487006],
[6, 9, 509.14536234753234],
[7, 33, 588.062921803441],
[8, 90, 428.51487722131657],
[9, 93, 867.5765095943988],
[10, 68, 114.56002793295748],
[11, 13, 219.9659064491586],
[12, 0, 756.3497868050205],
[13, 25, 277.6130400395486],
[14, 97, 71.02816342831905],
[15, 20, 804.114419718985],
[16, 74, 718.4928670487968],
[17, 63, 518.4833652104954],
[18, 88, 522.1800455781512],
[19, 42, 146.21901381147393],
[20, 21, 1014.4604477257849],
[21, 4, 177.67385851610248],
[22, 69, 154.983870128475],
[23, 88, 464.2456246428177],
[24, 60, 305.864349017665],
[25, 76, 643.0124415592594],
[26, 65, 86.31338250816034],
[27, 26, 367.2887147735416],
[28, 96, 798.1603848851432],
[29, 57, 678.0597318820813],
[30, 28, 42.43819034784589],
[31, 75, 527.1546262720266],
[32, 81, 103.78824596263297],
[33, 59, 441.50877680970285],
[34, 31, 723.7105775100983],
[35, 69, 235.73289969794203],
[36, 97, 91],
[37, 71, 409.5851559810243],
[38, 85, 156.77372228788855],
[39, 90, 293.2047066470796],
[40, 20, 326.92047962769175],
[41, 42, 185.60711193270586],
[42, 92, 188.91532494744834],
[43, 9, 263.20524310887123],
[44, 15, 618.8093405888441],
[45, 21, 366.23080154459973],
[46, 16, 461.93614277300276],
[47, 93, 422.80964984257395],
[48, 85, 453.82485608437094],
[49, 79, 380.25517747954467],
[50, 12, 426.4985345813043],
[51, 31, 497.8554006938159],
[52, 24, 189.4887859478761],
[53, 27, 631.3303414219848],
[54, 92, 565.574044666125],
[55, 44, 370.74249823833253],
[56, 82, 426.1267417095529],
[57, 72, 324.1249758966439],
[58, 53, 134.35773144854747],
[59, 87, 903.8191190719524],
[60, 84, 715.6605340522838],
[61, 66, 246.16457909293123],
[62, 79, 724.4101048439344],
[63, 94, 512.9103235459391],
[64, 85, 309.00647242412253],
[65, 55, 17.69180601295413],
[66, 83, 788.6507465285251],
[67, 76, 444.7077692147957],
[68, 16, 376.96949478704505],
[69, 28, 661.1051353604811],
[70, 17, 295.3303235362058],
[71, 6, 279.4154612758571],
[72, 16, 667.82782212184],
[73, 2, 338.3962174729499],
[74, 55, 754.3507141906873],
[75, 94, 682.4727100771137],
[76, 61, 759.8953875369951],
[77, 60, 583.5451996203893],
[78, 9, 609.269234411192],
[79, 15, 283.81684234731387],
[80, 20, 487.8985550296291],
[81, 55, 787.2896544474594],
[82, 78, 274.0894014733149],
[83, 12, 517.7200015452368],
[84, 1, 603.8311022131934],
[85, 87, 130.5450113945378],
[86, 34, 390.3549666649574],
[87, 8, 751.938827299136],
[88, 53, 440.70965498840616],
[89, 95, 48.373546489791295],
[90, 37, 722.2312649006549],
[91, 94, 391.9808668800047],
[92, 37, 733.6545508616437],
[93, 5, 156.31058825300352],
[94, 76, 651.2549423996719],
[95, 33, 524.0229002629561],
[96, 12, 384.6296920415791],
[97, 95, 209.60200380721554],
[98, 3, 756.3094604723651],
[99, 20, 334.0538878684096]]

const d3MSTNodes = [{ name: 1, id: '0', x: 500, y: 300 },
{ name: 2, id: '1', x: 499.6053456856543, y: 312.55810390586265 },
{ name: 3, id: '2', x: 498.42294026289557, y: 325.06664671286086 },
{ name: 4, id: '3', x: 496.45745014573777, y: 337.47626291714494 },
{ name: 5, id: '4', x: 493.71663222572624, y: 349.737977432971 },
{ name: 6, id: '5', x: 490.21130325903073, y: 361.80339887498945 },
{ name: 7, id: '6', x: 485.9552971776503, y: 373.6249105369356 },
{ name: 8, id: '7', x: 480.9654104932039, y: 385.15585831301456 },
{ name: 9, id: '8', x: 475.26133600877273, y: 396.35073482034306 },
{ name: 10, id: '9', x: 468.865585100403, y: 407.16535899579935 },
{ name: 11, id: '10', x: 461.8033988749895, y: 417.55705045849464 },
{ name: 12, id: '11', x: 454.1026485551579, y: 427.4847979497379 },
{ name: 13, id: '12', x: 445.7937254842823, y: 436.90942118573776 },
{ name: 14, id: '13', x: 436.90942118573776, y: 445.7937254842823 },
{ name: 15, id: '14', x: 427.4847979497379, y: 454.1026485551579 },
{ name: 16, id: '15', x: 417.55705045849464, y: 461.8033988749895 },
{ name: 17, id: '16', x: 407.1653589957993, y: 468.865585100403 },
{ name: 18, id: '17', x: 396.35073482034306, y: 475.26133600877273 },
{ name: 19, id: '18', x: 385.1558583130145, y: 480.9654104932039 },
{ name: 20, id: '19', x: 373.6249105369356, y: 485.95529717765027 },
{ name: 21, id: '20', x: 361.8033988749895, y: 490.21130325903073 },
{ name: 22, id: '21', x: 349.737977432971, y: 493.71663222572624 },
{ name: 23, id: '22', x: 337.47626291714494, y: 496.4574501457377 },
{ name: 24, id: '23', x: 325.06664671286086, y: 498.42294026289557 },
{ name: 25, id: '24', x: 312.5581039058627, y: 499.6053456856543 },
{ name: 26, id: '25', x: 300, y: 500 },
{ name: 27, id: '26', x: 287.4418960941373, y: 499.6053456856543 },
{ name: 28, id: '27', x: 274.93335328713914, y: 498.42294026289557 },
{ name: 29, id: '28', x: 262.52373708285506, y: 496.4574501457377 },
{ name: 30, id: '29', x: 250.26202256702908, y: 493.71663222572624 },
{ name: 31, id: '30', x: 238.19660112501055, y: 490.21130325903073 },
{ name: 32, id: '31', x: 226.3750894630644, y: 485.9552971776503 },
{ name: 33, id: '32', x: 214.84414168698544, y: 480.9654104932039 },
{ name: 34, id: '33', x: 203.6492651796569, y: 475.2613360087727 },
{ name: 35, id: '34', x: 192.83464100420062, y: 468.865585100403 },
{ name: 36, id: '35', x: 182.4429495415054, y: 461.8033988749895 },
{ name: 37, id: '36', x: 172.51520205026205, y: 454.1026485551579 },
{ name: 38, id: '37', x: 163.09057881426224, y: 445.7937254842823 },
{ name: 39, id: '38', x: 154.20627451571772, y: 436.90942118573776 },
{ name: 40, id: '39', x: 145.89735144484217, y: 427.484797949738 },
{ name: 41, id: '40', x: 138.19660112501055, y: 417.55705045849464 },
{ name: 42, id: '41', x: 131.13441489959703, y: 407.1653589957994 },
{ name: 43, id: '42', x: 124.7386639912273, y: 396.3507348203431 },
{ name: 44, id: '43', x: 119.03458950679612, y: 385.15585831301456 },
{ name: 45, id: '44', x: 114.04470282234973, y: 373.62491053693566 },
{ name: 46, id: '45', x: 109.7886967409693, y: 361.8033988749895 },
{ name: 47, id: '46', x: 106.28336777427378, y: 349.737977432971 },
{ name: 48, id: '47', x: 103.54254985426229, y: 337.476262917145 },
{ name: 49, id: '48', x: 101.57705973710443, y: 325.0666467128609 },
{ name: 50, id: '49', x: 100.3946543143457, y: 312.5581039058627 },
{ name: 51, id: '50', x: 100, y: 300 },
{ name: 52, id: '51', x: 100.3946543143457, y: 287.44189609413735 },
{ name: 53, id: '52', x: 101.57705973710443, y: 274.93335328713914 },
{ name: 54, id: '53', x: 103.54254985426229, y: 262.52373708285506 },
{ name: 55, id: '54', x: 106.28336777427378, y: 250.262022567029 },
{ name: 56, id: '55', x: 109.7886967409693, y: 238.19660112501046 },
{ name: 57, id: '56', x: 114.04470282234976, y: 226.37508946306434 },
{ name: 58, id: '57', x: 119.03458950679607, y: 214.84414168698555 },
{ name: 59, id: '58', x: 124.73866399122727, y: 203.649265179657 },
{ name: 60, id: '59', x: 131.13441489959698, y: 192.8346410042007 },
{ name: 61, id: '60', x: 138.19660112501052, y: 182.4429495415054 },
{ name: 62, id: '61', x: 145.89735144484214, y: 172.51520205026208 },
{ name: 63, id: '62', x: 154.2062745157177, y: 163.09057881426224 },
{ name: 64, id: '63', x: 163.09057881426222, y: 154.20627451571772 },
{ name: 65, id: '64', x: 172.51520205026208, y: 145.89735144484212 },
{ name: 66, id: '65', x: 182.44294954150536, y: 138.19660112501055 },
{ name: 67, id: '66', x: 192.83464100420073, y: 131.13441489959695 },
{ name: 68, id: '67', x: 203.64926517965694, y: 124.73866399122727 },
{ name: 69, id: '68', x: 214.84414168698555, y: 119.03458950679604 },
{ name: 70, id: '69', x: 226.37508946306428, y: 114.04470282234976 },
{ name: 71, id: '70', x: 238.1966011250105, y: 109.7886967409693 },
{ name: 72, id: '71', x: 250.26202256702894, y: 106.28336777427381 },
{ name: 73, id: '72', x: 262.52373708285506, y: 103.54254985426226 },
{ name: 74, id: '73', x: 274.9333532871391, y: 101.57705973710443 },
{ name: 75, id: '74', x: 287.44189609413735, y: 100.3946543143457 },
{ name: 76, id: '75', x: 299.99999999999994, y: 100 },
{ name: 77, id: '76', x: 312.5581039058626, y: 100.3946543143457 },
{ name: 78, id: '77', x: 325.06664671286086, y: 101.57705973710443 },
{ name: 79, id: '78', x: 337.4762629171448, y: 103.54254985426226 },
{ name: 80, id: '79', x: 349.737977432971, y: 106.28336777427378 },
{ name: 81, id: '80', x: 361.80339887498945, y: 109.78869674096927 },
{ name: 82, id: '81', x: 373.62491053693566, y: 114.04470282234976 },
{ name: 83, id: '82', x: 385.1558583130144, y: 119.03458950679601 },
{ name: 84, id: '83', x: 396.350734820343, y: 124.73866399122724 },
{ name: 85, id: '84', x: 407.1653589957992, y: 131.1344148995969 },
{ name: 86, id: '85', x: 417.5570504584946, y: 138.1966011250105 },
{ name: 87, id: '86', x: 427.48479794973787, y: 145.8973514448421 },
{ name: 88, id: '87', x: 436.90942118573776, y: 154.2062745157177 },
{ name: 89, id: '88', x: 445.7937254842823, y: 163.09057881426222 },
{ name: 90, id: '89', x: 454.1026485551579, y: 172.51520205026208 },
{ name: 91, id: '90', x: 461.80339887498945, y: 182.44294954150533 },
{ name: 92, id: '91', x: 468.865585100403, y: 192.83464100420073 },
{ name: 93, id: '92', x: 475.26133600877273, y: 203.64926517965694 },
{ name: 94, id: '93', x: 480.96541049320393, y: 214.84414168698555 },
{ name: 95, id: '94', x: 485.9552971776502, y: 226.37508946306426 },
{ name: 96, id: '95', x: 490.21130325903073, y: 238.1966011250105 },
{ name: 97, id: '96', x: 493.7166322257262, y: 250.26202256702894 },
{ name: 98, id: '97', x: 496.45745014573777, y: 262.52373708285506 },
{ name: 99, id: '98', x: 498.42294026289557, y: 274.9333532871391 },
{ name: 100, id: '99', x: 499.6053456856543, y: 287.44189609413735 }]

const d3MSTEdges = [{ source: 1, target: 0, value: 4331.285490475086, normalized: 1 },
{ source: 2, target: 1, value: 572.1975183448457, normalized: 0.12854843383354816 },
{ source: 3, target: 0, value: 1348.0819708014792, normalized: 0.3084180528130603 },
{ source: 4, target: 2, value: 437.47114190538326, normalized: 0.09731545588183324 },
{ source: 5, target: 3, value: 554.9071994487006, normalized: 0.12454010106951754 },
{ source: 6, target: 9, value: 509.14536234753234, normalized: 0.11393135104607291 },
{ source: 7, target: 33, value: 588.062921803441, normalized: 0.1322264351983368 },
{ source: 8, target: 90, value: 428.51487722131657, normalized: 0.09523916744596879 },
{ source: 9, target: 93, value: 867.5765095943988, normalized: 0.1970247468236958 },
{ source: 10, target: 68, value: 114.56002793295748, normalized: 0.022456501239078105 },
{ source: 11, target: 13, value: 219.9659064491586, normalized: 0.046892246983022544 },
{ source: 12, target: 0, value: 756.3497868050205, normalized: 0.17123958231225264 },
{ source: 13, target: 25, value: 277.6130400395486, normalized: 0.06025630901743227 },
{ source: 14, target: 97, value: 71.02816342831905, normalized: 0.012364715204282273 },
{ source: 15, target: 20, value: 804.114419718985, normalized: 0.18231263100620268 },
{ source: 16, target: 74, value: 718.4928670487968, normalized: 0.16246339184893038 },
{ source: 17, target: 63, value: 518.4833652104954, normalized: 0.1160961360365089 },
{ source: 18, target: 88, value: 522.1800455781512, normalized: 0.1169531199432156 },
{ source: 19, target: 42, value: 146.21901381147393, normalized: 0.02979585403731553 },
{ source: 20, target: 21, value: 1014.4604477257849, normalized: 0.23107615473920542 },
{ source: 21, target: 4, value: 177.67385851610248, normalized: 0.03708788175377179 },
{ source: 22, target: 69, value: 154.983870128475, normalized: 0.03182776917771754 },
{ source: 23, target: 88, value: 464.2456246428177, normalized: 0.10352245744386677 },
{ source: 24, target: 60, value: 305.864349017665, normalized: 0.06680567621441227 },
{ source: 25, target: 76, value: 643.0124415592594, normalized: 0.14496512219005564 },
{ source: 26, target: 65, value: 86.31338250816034, normalized: 0.015908215171583258 },
{ source: 27, target: 26, value: 367.2887147735416, normalized: 0.08104539609742571 },
{ source: 28, target: 96, value: 798.1603848851432, normalized: 0.1809323353016516 },
{ source: 29, target: 57, value: 678.0597318820813, normalized: 0.15308996956477822 },
{ source: 30, target: 28, value: 42.43819034784589, normalized: 0.005736837111949133 },
{ source: 31, target: 75, value: 527.1546262720266, normalized: 0.11810635343198721 },
{ source: 32, target: 81, value: 103.78824596263297, normalized: 0.019959330026795122 },
{ source: 33, target: 59, value: 441.50877680970285, normalized: 0.09825148166443383 },
{ source: 34, target: 31, value: 723.7105775100983, normalized: 0.16367298896052115 },
{ source: 35, target: 69, value: 235.73289969794203, normalized: 0.050547434374820066 },
{ source: 36, target: 97, value: 91, normalized: 0.0169946915146661 },
{ source: 37, target: 71, value: 409.5851559810243, normalized: 0.09085077979868562 },
{ source: 38, target: 85, value: 156.77372228788855, normalized: 0.032242702129298195 },
{ source: 39, target: 90, value: 293.2047066470796, normalized: 0.06387085126411936 },
{ source: 40, target: 20, value: 326.92047962769175, normalized: 0.07168701927782421 },
{ source: 41, target: 42, value: 185.60711193270586, normalized: 0.03892701033122208 },
{ source: 42, target: 92, value: 188.91532494744834, normalized: 0.039693937690806015 },
{ source: 43, target: 9, value: 263.20524310887123, normalized: 0.056916217672580934 },
{ source: 44, target: 15, value: 618.8093405888441, normalized: 0.13935423188817195 },
{ source: 45, target: 21, value: 366.23080154459973, normalized: 0.08080014508253468 },
{ source: 46, target: 16, value: 461.93614277300276, normalized: 0.10298706119685032 },
{ source: 47, target: 93, value: 422.80964984257395, normalized: 0.09391655159568756 },
{ source: 48, target: 85, value: 453.82485608437094, normalized: 0.10110666000889205 },
{ source: 49, target: 79, value: 380.25517747954467, normalized: 0.08405134975335514 },
{ source: 50, target: 12, value: 426.4985345813043, normalized: 0.09477172827865099 },
{ source: 51, target: 31, value: 497.8554006938159, normalized: 0.11131405269125018 },
{ source: 52, target: 24, value: 189.4887859478761, normalized: 0.03982688043932992 },
{ source: 53, target: 27, value: 631.3303414219848, normalized: 0.1422569162272747 },
{ source: 54, target: 92, value: 565.574044666125, normalized: 0.12701294529122698 },
{ source: 55, target: 44, value: 370.74249823833253, normalized: 0.08184607036520195 },
{ source: 56, target: 82, value: 426.1267417095529, normalized: 0.09468553729754615 },
{ source: 57, target: 72, value: 324.1249758966439, normalized: 0.07103895088391927 },
{ source: 58, target: 53, value: 134.35773144854747, normalized: 0.027046109107548125 },
{ source: 59, target: 87, value: 903.8191190719524, normalized: 0.20542669937849994 },
{ source: 60, target: 84, value: 715.6605340522838, normalized: 0.16180678550079072 },
{ source: 61, target: 66, value: 246.16457909293123, normalized: 0.05296576121737013 },
{ source: 62, target: 79, value: 724.4101048439344, normalized: 0.16383515707022414 },
{ source: 63, target: 94, value: 512.9103235459391, normalized: 0.11480416417447868 },
{ source: 64, target: 85, value: 309.00647242412253, normalized: 0.0675340998065034 },
{ source: 65, target: 55, value: 17.69180601295413, normalized: 0 },
{ source: 66, target: 83, value: 788.6507465285251, normalized: 0.17872776086737593 },
{ source: 67, target: 76, value: 444.7077692147957, normalized: 0.09899308892721702 },
{ source: 68, target: 16, value: 376.96949478704505, normalized: 0.08328964549170091 },
{ source: 69, target: 28, value: 661.1051353604811, normalized: 0.1491594657292705 },
{ source: 70, target: 17, value: 295.3303235362058, normalized: 0.06436362296322093 },
{ source: 71, target: 6, value: 279.4154612758571, normalized: 0.06067415579859781 },
{ source: 72, target: 16, value: 667.82782212184, normalized: 0.1507179543707887 },
{ source: 73, target: 2, value: 338.3962174729499, normalized: 0.07434738524752472 },
{ source: 74, target: 55, value: 754.3507141906873, normalized: 0.17077614677321845 },
{ source: 75, target: 94, value: 682.4727100771137, normalized: 0.154113009405301 },
{ source: 76, target: 61, value: 759.8953875369951, normalized: 0.17206154214234656 },
{ source: 77, target: 60, value: 583.5451996203893, normalized: 0.13117911305501 },
{ source: 78, target: 9, value: 609.269234411192, normalized: 0.13714259424320407 },
{ source: 79, target: 15, value: 283.81684234731387, normalized: 0.06169450713287179 },
{ source: 80, target: 20, value: 487.8985550296291, normalized: 0.1090058043042841 },
{ source: 81, target: 55, value: 787.2896544474594, normalized: 0.17841222533467882 },
{ source: 82, target: 78, value: 274.0894014733149, normalized: 0.05943944057223632 },
{ source: 83, target: 12, value: 517.7200015452368, normalized: 0.11591916905234245 },
{ source: 84, target: 1, value: 603.8311022131934, normalized: 0.1358818978040408 },
{ source: 85, target: 87, value: 130.5450113945378, normalized: 0.02616222426977507 },
{ source: 86, target: 34, value: 390.3549666649574, normalized: 0.0863927360600425 },
{ source: 87, target: 8, value: 751.938827299136, normalized: 0.17021701045487697 },
{ source: 88, target: 53, value: 440.70965498840616, normalized: 0.0980662250362597 },
{ source: 89, target: 95, value: 48.373546489791295, normalized: 0.0071128026237971724 },
{ source: 90, target: 37, value: 722.2312649006549, normalized: 0.16333004692247707 },
{ source: 91, target: 94, value: 391.9808668800047, normalized: 0.0867696608086353 },
{ source: 92, target: 37, value: 733.6545508616437, normalized: 0.16597825322019497 },
{ source: 93, target: 5, value: 156.31058825300352, normalized: 0.032135335958823376 },
{ source: 94, target: 76, value: 651.2549423996719, normalized: 0.14687594213355254 },
{ source: 95, target: 33, value: 524.0229002629561, normalized: 0.11738034021930303 },
{ source: 96, target: 12, value: 384.6296920415791, normalized: 0.08506547275195646 },
{ source: 97, target: 95, value: 209.60200380721554, normalized: 0.04448963250422391 },
{ source: 98, target: 3, value: 756.3094604723651, normalized: 0.171230233649489 },
{ source: 99, target: 20, value: 334.0538878684096, normalized: 0.07334072353523095 }];

describe('Make MST data', () => {

    it('make a 2d array to hold source, target, and weights', () => {
        const graph = makeGraph({ data: testData, selectedTags: selectedCols });

        expect(graph).to.deep.equal(mstData);
    });

    it('make the nodes to pass to the MST visual', () => {
        const mstNodes = makeMSTNodes(testData);

        expect(mstNodes).to.deep.equal(d3MSTNodes);
    });

    it('make MST edges', () => {
        const graph = makeGraph({ data: testData, selectedTags: selectedCols });
        const mstEdges = normalizeData(graph);

        expect(mstEdges).to.deep.equal(d3MSTEdges);
    });

    // it('test that the visual gets rendered', () => {
    //     expect(wrapper.html().indexOf('class="MST"') !== -1).to.equal(true);
    // });
});