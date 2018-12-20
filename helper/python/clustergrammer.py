'''
The clustergrammer python module can be installed using pip:
pip install clustergrammer

or by getting the code from the repo:
https://github.com/MaayanLab/clustergrammer-py
'''
# Install dependencies if not installed

try:
    from pip import main
except:
    from pip._internal import main
import imp
dependencies = ['pandas', 'sklearn', 'scipy']
versionOfDependencies = ['pandas', 'scikit-learn', 'scipy']
installing = False
def import_or_install(indexOfPackage):
    try:
        print(imp.find_module(dependencies[indexOfPackage]))
        if not installing:
            return False
        else:
            return True
    except ImportError:
        main(['install', '--user', versionOfDependencies[indexOfPackage]])
        return True

for index in range(len(dependencies)):
    installing = import_or_install(index)
print(installing)
if not installing:
    from clustergrammer import Network
    import sys
    net = Network()
    net.load_file(sys.argv[3])
    net.cluster(dist_type='cos',views=['N_row_sum', 'N_row_var'])
    print(sys.argv[4]);
    net.write_json_to_file('viz', sys.argv[4])