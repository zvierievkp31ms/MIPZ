import os

from python_metrics import CodeMetrics

def sum_dicts(dict1, dict2):
    combined_dict = dict1.copy()
    
    for key, value in dict2.items():
        if key in combined_dict:
            combined_dict[key] += value
        else:
            combined_dict[key] = value
            
    return combined_dict

def count_metrics_in_directory(directory_path, file_extension=None):
    metrics = {}
    for root, _, files in os.walk(directory_path):
        for file in files:
            if file_extension is None or file.endswith(file_extension):
                file_path = os.path.join(root, file)
                file = open(file_path, "r+")
                codeMetrics = CodeMetrics(file.read().split("\n")).getMetrics()
                metrics = sum_dicts(codeMetrics, metrics)
    
    return metrics

def print_metrics(metrics):
        print(f"""
Total: {metrics['total_lines']} LOC
Empty: {metrics['empty_lines']} LOC
Physical: {metrics['total_lines'] - metrics['empty_lines'] + min(metrics['total_lines'] * 0.25, metrics['empty_lines'])} LOC
Logical: {metrics['logical_lines']} LOC
Commented: {metrics['commented_lines']} LOC
Commenting rate: {(metrics['commented_lines'] / metrics['total_lines'] * 100 if metrics['total_lines'] > 0 else 0):.2f}%
Cyclomatic complexity: {(metrics['cyclomatic_complexity'])}""")

directory_path = './test'
file_extension = '.py'

if __name__ == '__main__':
    metrics = count_metrics_in_directory(directory_path, file_extension)
    print_metrics(metrics)