import utils.calculadora as calc
from utils import models
from datetime import datetime
import pandas as pd
import pytest

def test_load_dict():
    dicionario = models.loadDicionarioConteiner()
    assert isinstance(dicionario,pd.DataFrame)
 