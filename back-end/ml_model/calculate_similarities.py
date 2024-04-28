import numpy as np  # linear algebra
import pandas as pd  # data processing, CSV file I/O (e.g. pd.read_csv)
from io import BytesIO

array = None
detail_array = None
df = None
detail_df = None


def get_recipe_cosine_data():
    global array
    return array


def get_recipe_detail_data():
    global df
    return df


async def load_initial_data() -> list[any]:
    # data = pd.read_csv('output/similarities-second-too-big.csv');
    global array
    global df
    print('reading data')
    data = pd.read_parquet(
        "ml_model/large.parquet",
        engine='pyarrow'
    )
    df = pd.read_parquet(
        "ml_model/filtered-dataset.parquet",
        columns=['row_index', 'name', 'minutes', 'submitted', 'tags', 'nutrition', 'steps', 'description', 'ingredients'],
        engine='pyarrow'
    )
    # df = df.rename({'id': 'original_id'}, axis=1)
    print('detail data columns: ', df.columns)
    print('detail data shape: ', df.shape)
    # print('sorting...')
    # df.sort_values('id')
    # df['row_index'] = range(0, len(df))
    # df.set_index("row_index", inplace=True)
    # # df.head(20)
    print('data: ', df.shape)
    data = data.drop(data.columns[[0]], axis=1)
    data.head(10)
    data.info()
    data.describe()
    print('converting to array: ')
    array = data.to_numpy().tolist()
    # print('converted: ', array)
    return array


def print_recommendations(index_array: []):
    if index_array is not None:
        for index in index_array:
            print(df.loc[index, 'name'])


def retrieve_best_items(n_scores: int, row_no: int) -> list[int]:
    # retrieve row for the item
    max_indexes = []
    return_value = []
    if get_recipe_cosine_data():
        data_row = get_recipe_cosine_data()[row_no]
        result = list(filter(lambda x: x < 1, data_row))
        # print('Recipe: ', df.loc[row_no, 'name'],' \tsteps: ',df.loc[row_no, 'steps'])
        # print('result: ',result)
        for i in range(n_scores):
            # data_row = data_row[data_row<1]
            max_value = max(result)
            max_indexes.append(data_row.index(max_value))
            # remove max value to find next maximum
            result.remove(max_value)
        return_value = np.unique(max_indexes)
        print('\nRecommendations: ', )
        print_recommendations(return_value)
    return return_value
# result = retrieve_best_items(20, 2100)
